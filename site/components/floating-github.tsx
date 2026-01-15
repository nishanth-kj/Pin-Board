'use client';

import { Github, MessageSquarePlus } from 'lucide-react';
import { useState } from 'react';

export function FloatingGitHub() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-3">
            {isOpen && (
                <div className="flex flex-col gap-2 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-200">
                    <a
                        href="https://github.com/nishanth-kj/Pin-Board/issues/new?labels=bug"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl hover:border-red-500 transition-all text-xs md:text-sm font-bold"
                    >
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center text-sm md:text-base">
                            🐞
                        </div>
                        Report a Bug
                    </a>
                    <a
                        href="https://github.com/nishanth-kj/Pin-Board/issues/new?labels=enhancement"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl hover:border-blue-500 transition-all text-xs md:text-sm font-bold"
                    >
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-sm md:text-base">
                            💡
                        </div>
                        Suggest Feature
                    </a>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95
                    ${isOpen
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-blue-500'}
                `}
                aria-label="Feedback"
            >
                {isOpen ? <MessageSquarePlus size={20} className="md:w-6 md:h-6" /> : <Github size={20} className="md:w-6 md:h-6" />}
            </button>
        </div>
    );
}
