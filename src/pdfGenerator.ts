import { jsPDF } from 'jspdf';
import { Project, Settings } from './types';
import { computeLayout } from './layoutEngine';
import { detectDuplicates } from './duplicateDetection';

export function generatePDF(project: Project, settings: Settings) {
  const duplicateIds = detectDuplicates(project);
  const pages = computeLayout(project, settings, duplicateIds);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      doc.addPage();
    }
    const page = pages[i];

    for (const el of page.elements) {
      if (el.type === 'text') {
        const isTitle = el.fontStyle === 'bold' && el.fontSize && el.fontSize > 12;
        doc.setFont(isTitle ? 'times' : 'helvetica', el.fontStyle || 'normal');
        doc.setFontSize(el.fontSize || 12);
        doc.setTextColor(el.color || '#000000');
        
        // jsPDF text alignment
        const align = el.align === 'center' ? 'center' : el.align === 'right' ? 'right' : 'left';
        doc.text(el.text || '', el.x, el.y, { align, baseline: 'top' });
      } else if (el.type === 'rect') {
        doc.setDrawColor('#e2e8f0');
        doc.setFillColor(el.color || '#ffffff');
        doc.setLineWidth(0.2);
        if (el.rx && el.ry) {
          doc.roundedRect(el.x, el.y, el.w || 0, el.h || 0, el.rx, el.ry, 'FD');
        } else {
          doc.rect(el.x, el.y, el.w || 0, el.h || 0, 'FD');
        }
      } else if (el.type === 'line') {
        doc.setDrawColor(el.color || '#000000');
        doc.setLineWidth(0.2);
        doc.line(el.x, el.y, el.x2 || el.x, el.y2 || el.y);
      } else if (el.type === 'underline') {
        doc.setDrawColor(el.color || '#000000');
        doc.setLineWidth(0.5);
        doc.line(el.x, el.y, el.x + (el.w || 0), el.y);
      }
    }
  }

  doc.save(`${project.projectName || 'MCQ_Project'}.pdf`);
}
