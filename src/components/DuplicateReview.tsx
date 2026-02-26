import React, { useMemo } from 'react';
import { useApp } from '../store';
import { detectDuplicates } from '../duplicateDetection';

export function DuplicateReview() {
  const { state, dispatch } = useApp();
  const { project } = state;

  const duplicateGroups = useMemo(() => {
    const groups: { type: 'mcq' | 'prop'; text: string; items: { lessonId: string; mcqId: string; propId?: string }[] }[] = [];
    
    const mcqMap = new Map<string, { lessonId: string; mcqId: string }[]>();
    
    for (const lesson of project.lessons) {
      for (const mcq of lesson.mcqs) {
        const propsText = mcq.propositions.map(p => p.text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim()).join('||');
        const mcqKey = `${mcq.stem.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim()}||${propsText}`;
        
        if (!mcqMap.has(mcqKey)) mcqMap.set(mcqKey, []);
        mcqMap.get(mcqKey)!.push({ lessonId: lesson.id, mcqId: mcq.id });

        const propMap = new Map<string, { lessonId: string; mcqId: string; propId: string }[]>();
        for (const prop of mcq.propositions) {
          if (!prop.text.trim()) continue;
          const propKey = prop.text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
          if (!propMap.has(propKey)) propMap.set(propKey, []);
          propMap.get(propKey)!.push({ lessonId: lesson.id, mcqId: mcq.id, propId: prop.id });
        }
        
        for (const [text, items] of propMap.entries()) {
          if (items.length > 1) {
            groups.push({ type: 'prop', text, items });
          }
        }
      }
    }

    for (const [text, items] of mcqMap.entries()) {
      if (items.length > 1) {
        groups.push({ type: 'mcq', text, items });
      }
    }

    return groups;
  }, [project]);

  if (duplicateGroups.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-slate-100 pt-8 mt-8">
      <h2 className="font-sans text-[11px] font-bold text-red-500 uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        Review Duplicates <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[9px] ml-1">{duplicateGroups.length}</span>
      </h2>
      <div className="space-y-4">
        {duplicateGroups.map((group, idx) => (
          <div key={idx} className="bg-red-50/50 border border-red-100 rounded-2xl p-4 text-xs shadow-[0_2px_8px_rgba(239,68,68,0.04)]">
            <div className="font-semibold text-red-700 mb-1.5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              {group.type === 'mcq' ? 'Duplicate Question' : 'Repeated Option'}
            </div>
            <div className="text-slate-600 mb-3 italic truncate font-serif text-[13px] bg-white/60 px-2 py-1 rounded border border-red-50">"{group.text.substring(0, 60)}..."</div>
            <div className="space-y-1.5">
              {group.items.map((item, i) => {
                const lesson = project.lessons.find(l => l.id === item.lessonId);
                const mcq = lesson?.mcqs.find(m => m.id === item.mcqId);
                return (
                  <div key={i} className="flex items-center justify-between bg-white p-2 rounded-lg border border-red-100/60 shadow-sm hover:border-red-200 transition-colors">
                    <span className="truncate flex-1 mr-3 text-slate-600 font-medium">
                      <span className="text-slate-400 font-normal">{lesson?.title}</span> <span className="text-slate-300 mx-1">/</span> {mcq?.stem.substring(0, 25)}...
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          dispatch({ type: 'SET_ACTIVE_LESSON', payload: item.lessonId });
                          dispatch({ type: 'SET_ACTIVE_MCQ', payload: item.mcqId });
                        }}
                        className="text-[10px] font-semibold text-brand-600 hover:text-brand-700 uppercase tracking-wider bg-brand-50 hover:bg-brand-100 px-2 py-1 rounded transition-colors"
                      >
                        Jump
                      </button>
                      {group.type === 'mcq' && group.items.length > 1 && i > 0 && (
                        <button
                          onClick={() => dispatch({ type: 'DELETE_MCQ', payload: { lessonId: item.lessonId, mcqId: item.mcqId } })}
                          className="text-[10px] font-semibold text-red-600 hover:text-red-700 uppercase tracking-wider bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
