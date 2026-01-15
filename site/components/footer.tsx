'use client';

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full py-12 pb-40 md:pb-16 border-t border-slate-200 dark:border-slate-800 mt-20 relative z-10">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="max-w-sm">
                    <div className="text-xl font-black tracking-tighter mb-2 text-slate-900 dark:text-white">
                        📌 Pin-Board
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">
                        The native, minimalist workspace for focus and productivity.
                    </p>
                </div>

                <div className="flex flex-wrap gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-2">
                        <span className="font-bold uppercase tracking-widest text-[9px] text-slate-400">Product</span>
                        <div className="flex gap-4">
                            <Link href="/download" className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">Download</Link>
                            <Link href="/docs" className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">Docs</Link>
                            <Link href="/#features" className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">Features</Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="font-bold uppercase tracking-widest text-[9px] text-slate-400">Support</span>
                        <div className="flex gap-4">
                            <a href="https://github.com/nishanth-kj/Pin-Board/issues" className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">Issues</a>
                            <a href="https://github.com/nishanth-kj/Pin-Board/discussions" className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">Discussions</a>
                            <a href="mailto:support@pinboard.pro" className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
