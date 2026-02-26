import { Project, MCQ, Proposition } from './types';

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
}

export function detectDuplicates(project: Project): Set<string> {
  const duplicates = new Set<string>();
  const mcqMap = new Map<string, string[]>(); // normalized text -> mcq ids

  for (const lesson of project.lessons) {
    for (const mcq of lesson.mcqs) {
      // 1. Detect duplicate MCQs
      const propsText = mcq.propositions.map(p => normalizeText(p.text)).join('||');
      const mcqKey = `${normalizeText(mcq.stem)}||${propsText}`;
      
      if (mcqMap.has(mcqKey)) {
        mcqMap.get(mcqKey)!.push(mcq.id);
        duplicates.add(mcq.id);
        // Also mark the original as duplicate
        mcqMap.get(mcqKey)!.forEach(id => duplicates.add(id));
      } else {
        mcqMap.set(mcqKey, [mcq.id]);
      }

      // 2. Detect duplicate propositions within the same MCQ
      const propMap = new Map<string, string[]>();
      for (const prop of mcq.propositions) {
        if (!prop.text.trim()) continue; // Ignore empty props
        const propKey = normalizeText(prop.text);
        if (propMap.has(propKey)) {
          propMap.get(propKey)!.push(prop.id);
          duplicates.add(prop.id);
          propMap.get(propKey)!.forEach(id => duplicates.add(id));
        } else {
          propMap.set(propKey, [prop.id]);
        }
      }
    }
  }

  return duplicates;
}
