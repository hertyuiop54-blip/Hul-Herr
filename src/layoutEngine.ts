import { jsPDF } from 'jspdf';
import { Lesson, MCQ, Settings, Proposition, Project } from './types';

export interface LayoutPage {
  pageNumber: number;
  elements: LayoutElement[];
}

export interface LayoutElement {
  type: 'text' | 'rect' | 'line' | 'underline' | 'flag';
  x: number;
  y: number;
  w?: number;
  h?: number;
  rx?: number;
  ry?: number;
  x2?: number;
  y2?: number;
  text?: string;
  fontSize?: number;
  fontStyle?: 'normal' | 'bold' | 'italic';
  color?: string;
  align?: 'left' | 'center' | 'right';
  linkToPage?: number;
}

const A4_WIDTH = 210;
const A4_HEIGHT = 297;

// Create a dummy jsPDF instance for text measurement
const measureDoc = new jsPDF({ unit: 'mm', format: 'a4' });

function getTextWidth(text: string, fontSize: number, fontStyle: 'normal' | 'bold' | 'italic' = 'normal'): number {
  measureDoc.setFont('helvetica', fontStyle);
  measureDoc.setFontSize(fontSize);
  return measureDoc.getStringUnitWidth(text) * measureDoc.getFontSize() / (72 / 25.4);
}

function wrapText(text: string, maxWidth: number, fontSize: number, fontStyle: 'normal' | 'bold' | 'italic' = 'normal'): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = getTextWidth(currentLine + ' ' + word, fontSize, fontStyle);
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export function computeLayout(project: Project, settings: Settings, duplicateIds: Set<string>): LayoutPage[] {
  const { lessons, projectName } = project;
  const lessonPages: LayoutPage[] = [];
  let currentPageNumber = 1;
  let currentElements: LayoutElement[] = [];

  const {
    mcqTextSize,
    propTextSize,
    density,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    columnGap,
    enableExplanations
  } = settings;

  const colWidth = (A4_WIDTH - marginLeft - marginRight - columnGap) / 2;
  const maxY = A4_HEIGHT - marginBottom;
  const minY = marginTop;

  let currentX = marginLeft;
  let currentY = minY;
  let currentColumn = 0; // 0 for left, 1 for right
  let columnStartY = minY;

  const lessonTOC: { title: string, mcqCount: number, page: number }[] = [];

  function newPage() {
    if (currentColumn === 1) {
      currentElements.push({
        type: 'line',
        x: marginLeft + colWidth + columnGap / 2,
        y: columnStartY,
        x2: marginLeft + colWidth + columnGap / 2,
        y2: maxY,
        color: '#e2e8f0'
      });
    }
    lessonPages.push({ pageNumber: currentPageNumber, elements: currentElements });
    currentPageNumber++;
    currentElements = [];
    currentColumn = 0;
    currentX = marginLeft;
    currentY = minY;
    columnStartY = minY;
  }

  function nextColumn() {
    if (currentColumn === 0) {
      currentColumn = 1;
      currentX = marginLeft + colWidth + columnGap;
      currentY = columnStartY;
    } else {
      newPage();
    }
  }

  function addText(text: string, x: number, y: number, fontSize: number, fontStyle: 'normal' | 'bold' | 'italic', color: string = '#000000', align: 'left' | 'center' | 'right' = 'left', isDuplicate: boolean = false, isLastLine: boolean = true) {
    currentElements.push({ type: 'text', text, x, y, fontSize, fontStyle, color, align });
    if (isDuplicate && settings.highlightDuplicates) {
      const w = getTextWidth(text, fontSize, fontStyle);
      let ux = x;
      if (align === 'center') ux -= w / 2;
      else if (align === 'right') ux -= w;
      currentElements.push({ type: 'underline', x: ux, y: y + (fontSize * 0.35), w, color: '#ef4444' });
      
      if (isLastLine) {
        currentElements.push({ type: 'flag', x: ux + w + 2, y: y - fontSize * 0.25, color: '#ef4444', fontSize });
      }
    }
  }

  for (const lesson of lessons) {
    // Start lesson on a new page if not already at the top of a new page
    if (currentElements.length > 0) {
      newPage();
    }

    lessonTOC.push({ title: lesson.title, mcqCount: lesson.mcqs.length, page: currentPageNumber });

    // Lesson Title
    const titleFontSize = 20;
    const titleLines = wrapText(lesson.title, A4_WIDTH - marginLeft - marginRight - 12, titleFontSize, 'bold');
    const titleLineHeight = titleFontSize * 0.35 * density;
    
    let maxLineWidth = 0;
    for (const line of titleLines) {
      const w = getTextWidth(line, titleFontSize, 'bold');
      if (w > maxLineWidth) maxLineWidth = w;
    }
    
    const titleBoxWidth = Math.min(maxLineWidth + 20, A4_WIDTH - marginLeft - marginRight);
    const titleBoxX = (A4_WIDTH - titleBoxWidth) / 2;
    const titleBoxHeight = titleLines.length * titleLineHeight + 12;
    
    currentElements.push({
      type: 'rect',
      x: titleBoxX,
      y: currentY,
      w: titleBoxWidth,
      h: titleBoxHeight,
      rx: 3,
      ry: 3,
      color: '#f8fafc'
    });

    let textY = currentY + 6;
    for (const line of titleLines) {
      addText(line, A4_WIDTH / 2, textY, titleFontSize, 'bold', '#0f172a', 'center');
      textY += titleLineHeight;
    }
    currentY += titleBoxHeight + 10;
    columnStartY = currentY; // Right column should start below the title

    for (let i = 0; i < lesson.mcqs.length; i++) {
      const mcq = lesson.mcqs[i];
      const mcqNum = i + 1;
      
      // Pre-calculate MCQ height to see if we need to move to next column
      let mcqHeight = 0;
      const stemLines = wrapText(`${mcqNum}. ${mcq.stem}`, colWidth - 10, mcqTextSize, 'bold');
      const stemLineHeight = mcqTextSize * 0.35 * density;
      mcqHeight += stemLines.length * (stemLineHeight + 1);
      mcqHeight += 3; // space after stem

      const propLineHeight = propTextSize * 0.35 * density;
      const propsToRender = mcq.disableE ? mcq.propositions.slice(0, 4) : mcq.propositions;
      
      const propLinesArr: string[][] = [];
      for (const prop of propsToRender) {
        const lines = wrapText(`${prop.letter}) ${prop.text}`, colWidth - 14, propTextSize, 'normal');
        propLinesArr.push(lines);
        mcqHeight += lines.length * (propLineHeight + 1.5) + 1.5;
      }

      let expLines: string[] = [];
      const showExp = enableExplanations && mcq.showExplanationOverride !== false;
      if (showExp && mcq.explanation) {
        mcqHeight += 3;
        expLines = wrapText(`Explanation: ${mcq.explanation}`, colWidth - 14, propTextSize, 'italic');
        mcqHeight += expLines.length * (propLineHeight + 1.5);
      }

      mcqHeight += 6; // space after MCQ

      // Check if it fits
      if (currentY + mcqHeight > maxY) {
        if (mcqHeight <= maxY - columnStartY) {
          nextColumn();
        }
        // If it's taller than a full column, we just let it split across columns naturally below
      }

      // Render Stem
      const isMcqDuplicate = duplicateIds.has(mcq.id);
      for (let i = 0; i < stemLines.length; i++) {
        const line = stemLines[i];
        if (currentY + stemLineHeight > maxY) nextColumn();
        addText(line, currentX, currentY, mcqTextSize, 'bold', '#0f172a', 'left', isMcqDuplicate, i === stemLines.length - 1);
        currentY += stemLineHeight + 1;
      }
      currentY += 3;

      // Render Props
      for (let p = 0; p < propsToRender.length; p++) {
        const prop = propsToRender[p];
        const lines = propLinesArr[p];
        const isPropDuplicate = duplicateIds.has(prop.id);
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (currentY + propLineHeight > maxY) nextColumn();
          addText(line, currentX + 5, currentY, propTextSize, 'normal', '#475569', 'left', isPropDuplicate, i === lines.length - 1);
          currentY += propLineHeight + 1.5;
        }
        currentY += 1.5;
      }

      // Render Explanation
      if (showExp && mcq.explanation) {
        currentY += 1.5;
        for (const line of expLines) {
          if (currentY + propLineHeight > maxY) nextColumn();
          addText(line, currentX + 5, currentY, propTextSize, 'italic', '#64748b', 'left');
          currentY += propLineHeight + 1.5;
        }
      }

      currentY += 6;
    }

    // Answer Key Grid
    currentY += 10;
    const gridTitleSize = 14;
    if (currentY + 14 > maxY) nextColumn();
    addText('Answer Key', currentX, currentY, gridTitleSize, 'bold', '#1e293b');
    currentY += gridTitleSize * 0.35 + 6;

    const rowHeight = 8;
    const colW = 10;
    const maxCols = 5; // A B C D E
    
    // Draw header
    if (currentY + rowHeight > maxY) nextColumn();
    
    const textOffsetY = (rowHeight - propTextSize * 0.35) / 2;

    currentElements.push({ type: 'rect', x: currentX, y: currentY, w: colW, h: rowHeight, color: '#f1f5f9' });
    addText('#', currentX + colW/2, currentY + textOffsetY, propTextSize, 'bold', '#334155', 'center');
    
    for (let c = 0; c < maxCols; c++) {
      const letter = String.fromCharCode(65 + c);
      currentElements.push({ type: 'rect', x: currentX + colW * (c + 1), y: currentY, w: colW, h: rowHeight, color: '#f1f5f9' });
      addText(letter, currentX + colW * (c + 1) + colW/2, currentY + textOffsetY, propTextSize, 'bold', '#334155', 'center');
    }
    currentY += rowHeight;

    // Draw rows
    for (let i = 0; i < lesson.mcqs.length; i++) {
      const mcq = lesson.mcqs[i];
      if (currentY + rowHeight > maxY) {
        nextColumn();
        // Redraw header if we moved to a new column
        currentElements.push({ type: 'rect', x: currentX, y: currentY, w: colW, h: rowHeight, color: '#f1f5f9' });
        addText('#', currentX + colW/2, currentY + textOffsetY, propTextSize, 'bold', '#334155', 'center');
        for (let c = 0; c < maxCols; c++) {
          const letter = String.fromCharCode(65 + c);
          currentElements.push({ type: 'rect', x: currentX + colW * (c + 1), y: currentY, w: colW, h: rowHeight, color: '#f1f5f9' });
          addText(letter, currentX + colW * (c + 1) + colW/2, currentY + textOffsetY, propTextSize, 'bold', '#334155', 'center');
        }
        currentY += rowHeight;
      }

      currentElements.push({ type: 'rect', x: currentX, y: currentY, w: colW, h: rowHeight, color: '#ffffff' });
      addText(`${i + 1}`, currentX + colW/2, currentY + textOffsetY, propTextSize, 'normal', '#475569', 'center');

      for (let c = 0; c < maxCols; c++) {
        const letter = String.fromCharCode(65 + c);
        const isCorrect = mcq.correctAnswers.includes(letter);
        currentElements.push({ type: 'rect', x: currentX + colW * (c + 1), y: currentY, w: colW, h: rowHeight, color: '#ffffff' });
        if (isCorrect) {
          addText('X', currentX + colW * (c + 1) + colW/2, currentY + textOffsetY, propTextSize, 'bold', '#0f172a', 'center');
        }
      }
      currentY += rowHeight;
    }
  }

  if (currentElements.length > 0) {
    if (currentColumn === 1) {
      currentElements.push({
        type: 'line',
        x: marginLeft + colWidth + columnGap / 2,
        y: columnStartY,
        x2: marginLeft + colWidth + columnGap / 2,
        y2: maxY,
        color: '#e2e8f0'
      });
    }
    lessonPages.push({ pageNumber: currentPageNumber, elements: currentElements });
  }

  // Pass 2: Generate TOC pages
  const tocPages: LayoutPage[] = [];
  let tocCurrentPage = 1;
  let tocElements: LayoutElement[] = [];
  let tocY = minY;

  function newTocPage() {
    tocPages.push({ pageNumber: tocCurrentPage, elements: tocElements });
    tocCurrentPage++;
    tocElements = [];
    tocY = minY;
  }

  // TOC Title
  tocElements.push({ type: 'text', text: projectName || 'Module Index', x: A4_WIDTH / 2, y: tocY, fontSize: 24, fontStyle: 'bold', color: '#0f172a', align: 'center' });
  tocY += 16;

  tocElements.push({ type: 'text', text: 'Table of Contents', x: A4_WIDTH / 2, y: tocY, fontSize: 16, fontStyle: 'italic', color: '#475569', align: 'center' });
  tocY += 16;

  const tocFontSize = 12;
  const tocLineHeight = tocFontSize * 0.35 * 1.5;

  for (const item of lessonTOC) {
    if (tocY + tocLineHeight > maxY) {
      newTocPage();
    }
    
    const titleStr = item.title;
    const rightStr = `${item.mcqCount} MCQs  |  Page ${item.page}`;
    
    tocElements.push({ type: 'text', text: titleStr, x: marginLeft, y: tocY, fontSize: tocFontSize, fontStyle: 'bold', color: '#1e293b', align: 'left', linkToPage: item.page });
    tocElements.push({ type: 'text', text: rightStr, x: A4_WIDTH - marginRight, y: tocY, fontSize: tocFontSize, fontStyle: 'normal', color: '#475569', align: 'right', linkToPage: item.page });
    
    const titleW = getTextWidth(titleStr, tocFontSize, 'bold');
    const rightW = getTextWidth(rightStr, tocFontSize, 'normal');
    
    tocElements.push({
      type: 'line',
      x: marginLeft + titleW + 4,
      y: tocY + tocFontSize * 0.35 / 2,
      x2: A4_WIDTH - marginRight - rightW - 4,
      y2: tocY + tocFontSize * 0.35 / 2,
      color: '#e2e8f0'
    });

    tocY += tocLineHeight + 4;
  }

  if (tocElements.length > 0) {
    tocPages.push({ pageNumber: tocCurrentPage, elements: tocElements });
  }

  const tocPageCount = tocPages.length;

  for (const page of tocPages) {
    for (const el of page.elements) {
      if (el.linkToPage !== undefined) {
        el.linkToPage += tocPageCount;
      }
      if (el.align === 'right' && el.text?.includes('Page ')) {
        const match = el.text.match(/(.*Page )(\d+)/);
        if (match) {
          const oldPage = parseInt(match[2], 10);
          el.text = `${match[1]}${oldPage + tocPageCount}`;
        }
      }
    }
  }

  for (const page of lessonPages) {
    page.pageNumber += tocPageCount;
  }

  return [...tocPages, ...lessonPages];
}
