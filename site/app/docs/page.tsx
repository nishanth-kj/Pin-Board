'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Book, FileText, ChevronRight, Menu, X, Bug, Loader2, Zap } from 'lucide-react';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';

interface DocFile {
    id: string;
    title: string;
    path: string;
    icon: React.ReactNode;
}

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/nishanth-kj/Pin-Board/master/";
const GITHUB_API_BASE = "https://api.github.com/repos/nishanth-kj/Pin-Board/contents/";

export default function DocsPage() {
    const [docsList, setDocsList] = useState<DocFile[]>([
        { id: 'README.md', title: 'Introduction', path: 'README.md', icon: <Book size={18} /> }
    ]);
    const [activeDoc, setActiveDoc] = useState<DocFile>({ id: 'README.md', title: 'Introduction', path: 'README.md', icon: <Book size={18} /> });
    const [content, setContent] = useState<string>('');
    const [loadingContent, setLoadingContent] = useState<boolean>(true);
    const [loadingList, setLoadingList] = useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    // Fetch file list from GitHub /docs directory
    useEffect(() => {
        async function fetchDocsList() {
            try {
                const res = await fetch(`${GITHUB_API_BASE}docs`);
                if (res.ok) {
                    const files = await res.json();
                    const dynamicDocs = files
                        .filter((file: any) => file.name.endsWith('.md'))
                        .map((file: any) => ({
                            id: file.path,
                            title: file.name.replace('.md', '').replace(/_/g, ' '),
                            path: file.path,
                            icon: <FileText size={18} />
                        }));

                    setDocsList([
                        { id: 'README.md', title: 'Introduction', path: 'README.md', icon: <Book size={18} /> },
                        ...dynamicDocs
                    ]);
                }
            } catch (err) {
                console.error('Failed to fetch docs list:', err);
            } finally {
                setLoadingList(false);
            }
        }
        fetchDocsList();
    }, []);

    // Fetch individual doc content
    useEffect(() => {
        async function fetchDoc() {
            setLoadingContent(true);
            try {
                const res = await fetch(`${GITHUB_RAW_BASE}${activeDoc.path}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const text = await res.text();
                setContent(text);
            } catch (err) {
                setContent('# Error\nFailed to load documentation from GitHub.');
            } finally {
                setLoadingContent(false);
            }
        }
        fetchDoc();
    }, [activeDoc]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-gray-200 font-sans selection:bg-blue-500/30 transition-colors duration-300 relative overflow-hidden">

            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <main className="container mx-auto px-4 py-16 relative z-10">
                <Navbar />

                <div className="flex flex-col lg:flex-row gap-12 mt-10">

                    {/* Sidebar Toggle for Mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold shadow-sm"
                    >
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        {isSidebarOpen ? 'Close Menu' : 'Documentation Menu'}
                    </button>

                    {/* Sidebar */}
                    <aside className={`
                        lg:w-64 flex-shrink-0 
                        ${isSidebarOpen ? 'fixed inset-0 z-50 bg-white dark:bg-black p-8' : 'hidden lg:block'}
                    `}>
                        <div className="flex items-center justify-between mb-8 lg:hidden">
                            <span className="text-xl font-black italic">Menu</span>
                            <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                        </div>

                        <div className="sticky top-32 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-4">Guides</h3>
                                <div className="space-y-1">
                                    {loadingList ? (
                                        <div className="px-4 py-2 flex items-center gap-2 text-sm text-slate-400">
                                            <Loader2 size={16} className="animate-spin" /> Loading Docs...
                                        </div>
                                    ) : (
                                        docsList.map((doc) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => {
                                                    setActiveDoc(doc);
                                                    setIsSidebarOpen(false);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`
                                                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                                                    ${activeDoc.id === doc.id
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                        : 'hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-500'}
                                                `}
                                            >
                                                {doc.icon}
                                                <span className="capitalize">{doc.title}</span>
                                                {activeDoc.id === doc.id && <ChevronRight size={14} className="ml-auto" />}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-4">Community</h3>
                                <a
                                    href="https://github.com/nishanth-kj/Pin-Board/issues/new?labels=bug"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Bug size={18} />
                                    <span>Report a Bug</span>
                                </a>
                                <a
                                    href="https://github.com/nishanth-kj/Pin-Board/issues/new?labels=enhancement"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                                >
                                    <Zap size={18} />
                                    <span>Suggest Feature</span>
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden min-h-[600px]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                            {loadingContent ? (
                                <div className="space-y-8 animate-pulse">
                                    <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-3xl w-3/4"></div>
                                    <div className="space-y-4">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-slate dark:prose-invert max-w-none 
                                    prose-headings:font-black prose-headings:tracking-tighter
                                    prose-h1:text-4xl md:prose-h1:text-6xl prose-h1:mb-12 prose-h1:text-slate-900 dark:prose-h1:text-white
                                    prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
                                    prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
                                    prose-a:text-blue-500 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-slate-900 dark:prose-strong:text-white
                                    prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none
                                    prose-pre:bg-slate-950 dark:prose-pre:bg-black prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-3xl prose-pre:shadow-2xl
                                    prose-ul:list-disc prose-ol:list-decimal
                                    prose-li:text-lg prose-li:my-2
                                    prose-img:rounded-3xl prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-800
                                ">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
