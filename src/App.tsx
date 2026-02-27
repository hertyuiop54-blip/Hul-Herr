import React from 'react';
import { AppProvider, useApp } from './store';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { generatePDF } from './pdfGenerator';
import { AIBubble } from './components/AIBubble';

function MainLayout() {
  const { state, dispatch } = useApp();

  return (
    <div className="flex h-screen w-full mesh-bg overflow-hidden font-sans text-slate-900">
      <Editor />
      
      <div className="flex-1 flex flex-col h-full relative border-l border-white/60">
        <div className="h-16 glass-panel border-b border-white/60 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-xl font-medium tracking-tight text-slate-800">Preview</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={state.past.length === 0}
              className="text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 px-3 py-2 rounded-full hover:bg-slate-100 transition-all flex items-center gap-2 text-sm font-medium"
              title="Undo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
              Undo
            </button>
            <button
              onClick={() => generatePDF(state.project, state.settings)}
              className="group bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all flex items-center gap-2 hover:shadow-md active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download PDF
            </button>
          </div>
        </div>
        
        <Preview />
        <AIBubble />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
