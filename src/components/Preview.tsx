import React, { useMemo } from 'react';
import { useApp } from '../store';
import { computeLayout, LayoutPage } from '../layoutEngine';
import { detectDuplicates } from '../duplicateDetection';

export function Preview() {
  const { state } = useApp();
  const { project, settings } = state;

  const duplicateIds = useMemo(() => detectDuplicates(project), [project]);
  const pages = useMemo(() => computeLayout(project, settings, duplicateIds), [project, settings, duplicateIds]);

  return (
    <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center gap-12">
      {pages.map((page) => (
        <A4Page key={page.pageNumber} page={page} />
      ))}
      {pages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          <p className="font-serif text-lg">No content to preview</p>
          <p className="text-sm font-sans mt-1">Add a lesson to get started</p>
        </div>
      )}
    </div>
  );
}

const A4Page: React.FC<{ page: LayoutPage }> = ({ page }) => {
  // A4 ratio is 210x297. We scale it up for preview, e.g., 1mm = 3.78px (96dpi)
  // Let's use a fixed scale for the preview container, e.g., 210mm -> 794px, 297mm -> 1123px
  const scale = 3.78;
  const width = 210 * scale;
  const height = 297 * scale;

  return (
    <div
      id={`page-${page.pageNumber}`}
      className="bg-white relative shrink-0 shadow-[0_20px_40px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.05)] rounded-sm"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {page.elements.map((el, i) => {
        if (el.type === 'text') {
          const isLink = el.linkToPage !== undefined;
          return (
            <div
              key={i}
              onClick={() => {
                if (isLink) {
                  document.getElementById(`page-${el.linkToPage}`)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                position: 'absolute',
                left: `${el.x * scale}px`,
                top: `${el.y * scale}px`,
                fontSize: `${el.fontSize}pt`,
                fontWeight: el.fontStyle === 'bold' ? '600' : '400',
                fontStyle: el.fontStyle === 'italic' ? 'italic' : 'normal',
                color: el.color,
                textAlign: el.align,
                transform: el.align === 'center' ? 'translateX(-50%)' : el.align === 'right' ? 'translateX(-100%)' : 'none',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                fontFamily: el.fontStyle === 'bold' && el.fontSize && el.fontSize > 12 ? 'var(--font-serif)' : 'var(--font-sans)',
                letterSpacing: el.fontStyle === 'bold' && el.fontSize && el.fontSize > 12 ? '-0.02em' : 'normal',
                cursor: isLink ? 'pointer' : 'default',
              }}
              className={isLink ? 'hover:text-brand-600 transition-colors' : ''}
            >
              {el.text}
            </div>
          );
        }
        if (el.type === 'rect') {
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${el.x * scale}px`,
                top: `${el.y * scale}px`,
                width: `${el.w! * scale}px`,
                height: `${el.h! * scale}px`,
                backgroundColor: el.color,
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: el.rx ? `${el.rx * scale}px` : '0',
              }}
            />
          );
        }
        if (el.type === 'line') {
          const isVertical = el.x === el.x2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${el.x * scale}px`,
                top: `${el.y * scale}px`,
                width: isVertical ? '1px' : `${(el.x2! - el.x) * scale}px`,
                height: isVertical ? `${(el.y2! - el.y) * scale}px` : '1px',
                backgroundColor: el.color || '#000',
              }}
            />
          );
        }
        if (el.type === 'underline') {
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${el.x * scale}px`,
                top: `${el.y * scale}px`,
                width: `${el.w! * scale}px`,
                height: '2px',
                backgroundColor: el.color,
                opacity: 0.5,
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
