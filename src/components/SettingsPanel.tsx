import React from 'react';
import { useApp } from '../store';

export function SettingsPanel() {
  const { state, dispatch } = useApp();
  const { settings } = state;

  const update = (key: keyof typeof settings, value: any) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  return (
    <div className="border-t border-slate-100 pt-8 mt-8">
      <h2 className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-5">Global Controls</h2>
      <div className="space-y-5 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-slate-600">MCQ Text Size <span className="text-slate-400 font-mono ml-1">{settings.mcqTextSize}pt</span></label>
            <input type="range" min="8" max="24" value={settings.mcqTextSize} onChange={(e) => update('mcqTextSize', Number(e.target.value))} className="w-32 accent-brand-500" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-slate-600">Prop Text Size <span className="text-slate-400 font-mono ml-1">{settings.propTextSize}pt</span></label>
            <input type="range" min="8" max="20" value={settings.propTextSize} onChange={(e) => update('propTextSize', Number(e.target.value))} className="w-32 accent-brand-500" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-slate-600">Density <span className="text-slate-400 font-mono ml-1">{settings.density.toFixed(1)}</span></label>
            <input type="range" min="0.8" max="2.0" step="0.1" value={settings.density} onChange={(e) => update('density', Number(e.target.value))} className="w-32 accent-brand-500" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-slate-600">Column Gap <span className="text-slate-400 font-mono ml-1">{settings.columnGap}mm</span></label>
            <input type="range" min="5" max="30" value={settings.columnGap} onChange={(e) => update('columnGap', Number(e.target.value))} className="w-32 accent-brand-500" />
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-200/60">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-3">Page Margins (mm)</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
              <label className="text-[10px] text-slate-400 font-medium uppercase">Top</label>
              <input type="number" value={settings.marginTop} onChange={(e) => update('marginTop', Number(e.target.value))} className="w-12 text-right text-sm font-mono outline-none text-slate-700" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
              <label className="text-[10px] text-slate-400 font-medium uppercase">Bottom</label>
              <input type="number" value={settings.marginBottom} onChange={(e) => update('marginBottom', Number(e.target.value))} className="w-12 text-right text-sm font-mono outline-none text-slate-700" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
              <label className="text-[10px] text-slate-400 font-medium uppercase">Left</label>
              <input type="number" value={settings.marginLeft} onChange={(e) => update('marginLeft', Number(e.target.value))} className="w-12 text-right text-sm font-mono outline-none text-slate-700" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
              <label className="text-[10px] text-slate-400 font-medium uppercase">Right</label>
              <input type="number" value={settings.marginRight} onChange={(e) => update('marginRight', Number(e.target.value))} className="w-12 text-right text-sm font-mono outline-none text-slate-700" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/60 space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-[12px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Enable Explanations</span>
            <div className="relative flex items-center">
              <input type="checkbox" checked={settings.enableExplanations} onChange={(e) => update('enableExplanations', e.target.checked)} className="peer sr-only" />
              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-500"></div>
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-[12px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Highlight Duplicates</span>
            <div className="relative flex items-center">
              <input type="checkbox" checked={settings.highlightDuplicates} onChange={(e) => update('highlightDuplicates', e.target.checked)} className="peer sr-only" />
              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-500"></div>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-200/60">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-3">AI Assistant</label>
          <div className="space-y-2">
            <div className="flex justify-between mb-1">
              <span className="text-[12px] font-medium text-slate-600">Gemini API Key</span>
            </div>
            <input
              type="password"
              value={settings.geminiApiKey || ''}
              onChange={(e) => update('geminiApiKey', e.target.value)}
              placeholder="Enter your Gemini API Key..."
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all bg-white shadow-sm"
            />
            <p className="text-[10px] text-slate-400 mt-1">Required for the AI Assistant to work properly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
