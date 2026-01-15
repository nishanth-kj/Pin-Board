'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Menu, X, Book, Download, Zap, ChevronRight } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    return (
        <nav className="w-full max-w-6xl mx-auto flex justify-between items-center mb-16 md:mb-24 px-4 relative z-50">
            <Link href="/" className="text-xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-2 group">
                <span className="text-blue-500">📌</span> Pin-Board
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-10 text-sm font-bold text-slate-600 dark:text-gray-400 items-center">
                <Link href="/docs" className="hover:text-blue-600 dark:hover:text-white transition-colors">Docs</Link>
                <Link href="/#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">Features</Link>
                <Link href="/download" className="hover:text-blue-600 dark:hover:text-white transition-colors">Download</Link>
                <a href="https://github.com/nishanth-kj/Pin-Board" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                    <Github size={16} /> GitHub
                </a>
                <ThemeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-3 md:hidden">
                <ThemeToggle />
                {!isMenuOpen && (
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-3 text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm z-[60]"
                        aria-label="Open Menu"
                    >
                        <Menu size={20} />
                    </button>
                )}
            </div>

            {/* Premium Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-50/98 dark:bg-black/98 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col md:hidden">
                    {/* Perfect Header Alignment */}
                    <div className="flex justify-between items-center px-4 h-[88px] w-full max-w-6xl mx-auto">
                        <div className="text-xl font-black tracking-tighter">
                            📌 Pin-Board
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-3 text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
                            aria-label="Close Menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 px-6 overflow-y-auto pb-10">
                        <MobileNavLink
                            href="/docs"
                            icon={<Book className="text-blue-500" size={20} />}
                            title="Documentation"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <MobileNavLink
                            href="/#features"
                            icon={<Zap className="text-yellow-500" size={20} />}
                            title="Features"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <MobileNavLink
                            href="/download"
                            icon={<Download className="text-green-500" size={20} />}
                            title="Download"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <a
                            href="https://github.com/nishanth-kj/Pin-Board"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] active:scale-[0.98] transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Github size={20} />
                            </div>
                            <div className="font-bold text-lg tracking-tight">GitHub</div>
                            <ChevronRight className="ml-auto text-slate-300" size={18} />
                        </a>
                    </div>

                    <div className="mt-auto p-10 text-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">v1.0.0 Stable</div>
                        <p className="text-[9px] font-medium text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                            Minimalist workspace built with Rust for ultimate desktop focus.
                        </p>
                    </div>
                </div>
            )}
        </nav>
    );
}

function MobileNavLink({ href, icon, title, onClick }: { href: string, icon: React.ReactNode, title: string, onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] active:scale-[0.98] transition-all"
        >
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {icon}
            </div>
            <div className="font-bold text-lg tracking-tight">{title}</div>
            <ChevronRight className="ml-auto text-slate-300" size={18} />
        </Link>
    );
}
