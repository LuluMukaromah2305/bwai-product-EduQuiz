import React from 'react';
import { Sparkles, GraduationCap } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 border-b border-slate-700 shadow-lg relative z-25">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-md shadow-indigo-600/30">
            E
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-lg font-display font-bold tracking-tight text-white leading-none">
              EduQuiz <span className="text-indigo-400">Pro</span>
            </span>
            <span className="hidden sm:inline-block bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-500/20">
              AI HOTS Engine
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-slate-400">
          <span className="hidden md:inline">Assessment Engine v2.5</span>
          <div className="hidden md:block w-px h-4 bg-slate-700"></div>
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            <span>HOTS-Adaptive Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
}
