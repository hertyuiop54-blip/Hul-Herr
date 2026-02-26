import React, { useRef } from 'react';
import { useApp, createEmptyMCQ } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { SettingsPanel } from './SettingsPanel';
import { DuplicateReview } from './DuplicateReview';
import { detectDuplicates } from '../duplicateDetection';

export function Editor() {
  const { state, dispatch } = useApp();
  const { project, activeLessonId, activeMcqId } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeLesson = project.lessons.find((l) => l.id === activeLessonId);
  const activeMcq = activeLesson?.mcqs.find((m) => m.id === activeMcqId);

  const duplicateIds = detectDuplicates(project);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.projectName && json.lessons) {
          dispatch({ type: 'LOAD_PROJECT', payload: json });
        } else {
          alert('Invalid project file format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-[420px] glass-panel border-r border-white/60 flex flex-col h-full overflow-y-auto z-20">
      <div className="p-6 border-b border-white/60 flex items-center justify-between sticky top-0 bg-white/40 backdrop-blur-md z-10">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">MCQ Studio</h1>
        <div className="flex items-center gap-2">
          <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleImport} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full"
            title="Import JSON"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Import
          </button>
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project));
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href", dataStr);
              downloadAnchorNode.setAttribute("download", project.projectName + ".json");
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
            className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full"
            title="Export JSON"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      <div className="p-6 border-b border-slate-100">
        <input
          type="text"
          value={project.projectName}
          onChange={(e) => dispatch({ type: 'LOAD_PROJECT', payload: { ...project, projectName: e.target.value } })}
          className="w-full font-serif text-3xl font-medium text-slate-800 border-none outline-none focus:ring-0 placeholder-slate-300 transition-all"
          placeholder="Project Title"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Lessons List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Lessons</h2>
            <button
              onClick={() => dispatch({ type: 'ADD_LESSON', payload: { id: uuidv4(), title: 'New Lesson', mcqs: [] } })}
              className="text-brand-600 hover:text-brand-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Lesson
            </button>
          </div>
          <div className="space-y-3">
            {project.lessons.map((lesson) => (
              <div key={lesson.id} className={`group border rounded-xl overflow-hidden transition-all duration-200 ${activeLessonId === lesson.id ? 'border-brand-200 bg-brand-50/30 shadow-[0_2px_8px_rgba(20,184,166,0.08)]' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    activeLessonId === lesson.id ? 'bg-brand-50/50' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_LESSON', payload: lesson.id })}
                >
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => dispatch({ type: 'UPDATE_LESSON', payload: { id: lesson.id, updates: { title: e.target.value } } })}
                    className="bg-transparent border-none outline-none font-medium text-sm flex-1 text-slate-700 focus:text-slate-900"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'DELETE_LESSON', payload: lesson.id });
                    }}
                    className="text-slate-400 hover:text-red-500 text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete Lesson"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
                
                {/* MCQs List if active */}
                {activeLessonId === lesson.id && (
                  <div className="p-2 space-y-1.5 border-t border-brand-100/50 bg-white/50">
                    {lesson.mcqs.map((mcq, idx) => (
                      <div
                        key={mcq.id}
                        className={`flex items-center justify-between p-2.5 text-sm rounded-lg cursor-pointer transition-all ${
                          activeMcqId === mcq.id ? 'bg-white shadow-sm border border-brand-200 text-brand-900 font-medium' : 'hover:bg-slate-50 border border-transparent text-slate-600'
                        }`}
                        onClick={() => dispatch({ type: 'SET_ACTIVE_MCQ', payload: mcq.id })}
                      >
                        <span className="truncate flex-1 font-mono text-xs tracking-tight">
                          <span className="text-slate-400 mr-1.5">{String(idx + 1).padStart(2, '0')}.</span> 
                          <span className={activeMcqId === mcq.id ? 'font-sans text-sm' : 'font-sans text-sm'}>{mcq.stem || 'Empty Question'}</span>
                        </span>
                        {duplicateIds.has(mcq.id) && (
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm ml-2">Dup</span>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => dispatch({ type: 'ADD_MCQ', payload: { lessonId: lesson.id, mcq: createEmptyMCQ() } })}
                      className="w-full text-center text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 py-2 mt-2 border border-dashed border-slate-300 hover:border-slate-400 rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      Add Question
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active MCQ Editor */}
        {activeLessonId && activeMcq && (
          <div className="border-t border-slate-100 pt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Edit Question</h2>
              <div className="flex gap-1">
                <button
                  onClick={() => dispatch({ type: 'DUPLICATE_MCQ', payload: { lessonId: activeLessonId, mcqId: activeMcq.id } })}
                  className="text-xs text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded transition-colors"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => dispatch({ type: 'DELETE_MCQ', payload: { lessonId: activeLessonId, mcqId: activeMcq.id } })}
                  className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Stem</label>
                <textarea
                  value={activeMcq.stem}
                  onChange={(e) => dispatch({ type: 'UPDATE_MCQ', payload: { lessonId: activeLessonId, mcqId: activeMcq.id, updates: { stem: e.target.value } } })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm min-h-[80px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-y shadow-sm"
                  placeholder="Enter your question here..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Choices</label>
                  <label className="flex items-center text-xs text-slate-500 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={activeMcq.disableE || false}
                        onChange={(e) => dispatch({ type: 'UPDATE_MCQ', payload: { lessonId: activeLessonId, mcqId: activeMcq.id, updates: { disableE: e.target.checked } } })}
                        className="peer sr-only"
                      />
                      <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-500"></div>
                    </div>
                    <span className="ml-2 group-hover:text-slate-800 transition-colors">Disable E (4 choices)</span>
                  </label>
                </div>
                <div className="space-y-2.5">
                  {(activeMcq.disableE ? activeMcq.propositions.slice(0, 4) : activeMcq.propositions).map((prop, idx) => (
                    <div key={prop.id} className="flex items-start gap-3 group">
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input
                            type="checkbox"
                            checked={activeMcq.correctAnswers.includes(prop.letter)}
                            onChange={(e) => {
                              const newAnswers = e.target.checked
                                ? [...activeMcq.correctAnswers, prop.letter]
                                : activeMcq.correctAnswers.filter((a) => a !== prop.letter);
                              dispatch({ type: 'UPDATE_MCQ', payload: { lessonId: activeLessonId, mcqId: activeMcq.id, updates: { correctAnswers: newAnswers } } });
                            }}
                            className="peer appearance-none w-5 h-5 border border-slate-300 rounded-md checked:bg-brand-500 checked:border-brand-500 transition-colors cursor-pointer"
                          />
                          <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="font-mono font-bold text-sm text-slate-400 group-hover:text-slate-600 w-3 text-center">{prop.letter}</span>
                      </label>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={prop.text}
                          onChange={(e) => {
                            const newProps = [...activeMcq.propositions];
                            newProps[idx] = { ...prop, text: e.target.value };
                            dispatch({ type: 'UPDATE_MCQ', payload: { lessonId: activeLessonId, mcqId: activeMcq.id, updates: { propositions: newProps } } });
                          }}
                          className={`w-full border rounded-lg p-2 text-sm outline-none transition-all shadow-sm ${duplicateIds.has(prop.id) ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'}`}
                          placeholder={`Option ${prop.letter}`}
                        />
                        {duplicateIds.has(prop.id) && <div className="text-[10px] text-red-500 mt-1 font-medium flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Repeated proposition</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {state.settings.enableExplanations && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Explanation</label>
                    <label className="flex items-center text-xs text-slate-500 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={activeMcq.showExplanationOverride !== false}
                          onChange={(e) => dispatch({ type: 'UPDATE_MCQ', payload: { lessonId: activeLessonId, mcqId: activeMcq.id, updates: { showExplanationOverride: e.target.checked } } })}
                          className="peer sr-only"
                        />
                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-500"></div>
                      </div>
                      <span className="ml-2 group-hover:text-slate-800 transition-colors">Show</span>
                    </label>
                  </div>
                  <textarea
                    value={activeMcq.explanation || ''}
                    onChange={(e) => dispatch({ type: 'UPDATE_MCQ', payload: { lessonId: activeLessonId, mcqId: activeMcq.id, updates: { explanation: e.target.value } } })}
                    className={`w-full border border-slate-200 rounded-xl p-3 text-sm min-h-[60px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-y shadow-sm ${activeMcq.showExplanationOverride === false ? 'opacity-50 bg-slate-50' : ''}`}
                    disabled={activeMcq.showExplanationOverride === false}
                    placeholder="Optional explanation..."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <DuplicateReview />
        <SettingsPanel />
      </div>
    </div>
  );
}
