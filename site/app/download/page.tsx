'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Monitor, Apple, Terminal, Github, Calendar, Tag } from 'lucide-react';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';

interface Asset {
    name: string;
    browser_download_url: string;
    size: number;
}

interface Release {
    tag_name: string;
    name: string;
    published_at: string;
    body: string;
    html_url: string;
    assets: Asset[];
}

export default function DownloadPage() {
    const [release, setRelease] = useState<Release | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLatest() {
            try {
                const res = await fetch('https://api.github.com/repos/nishanth-kj/Pin-Board/releases/latest');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setRelease(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchLatest();
    }, []);

    const getAssetLink = (platform: 'windows' | 'linux' | 'macos') => {
        if (!release) return '#';
        const asset = release.assets.find(a =>
            a.name.toLowerCase().includes(platform) &&
            (a.name.endsWith('.zip') || a.name.endsWith('.tar.gz') || a.name.endsWith('.dmg'))
        );
        return asset ? asset.browser_download_url : release.html_url;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-gray-200 font-sans selection:bg-blue-500/30 transition-colors duration-300 relative overflow-hidden">

            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <main className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center">
                <Navbar />

                <div className="text-center max-w-3xl mb-16 pt-10">
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-slate-900 dark:text-white leading-tight">
                        Get Pin-Board
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Experience the ultimate floating sticky notes. Native, fast, and always where you need it.
                    </p>
                </div>

                {/* Platform Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-20 relative">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
                    <DownloadCard
                        icon={<Monitor size={32} />}
                        title="Windows"
                        subtitle="v10 / 11 (x64)"
                        href={getAssetLink('windows')}
                        loading={loading}
                        color="text-blue-500"
                    />
                    <DownloadCard
                        icon={<Apple size={32} />}
                        title="macOS"
                        subtitle="Intel / Apple Silicon"
                        href={getAssetLink('macos')}
                        loading={loading}
                        color="text-slate-900 dark:text-white"
                    />
                    <DownloadCard
                        icon={<Terminal size={32} />}
                        title="Linux"
                        subtitle="Generic Binary (x64)"
                        href={getAssetLink('linux')}
                        loading={loading}
                        color="text-orange-500"
                    />
                </div>

                {/* Dynamic Release Notes */}
                <div className="w-full max-w-5xl bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                    {loading ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-1/4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            </div>
                        </div>
                    ) : release ? (
                        <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
                            <div className="space-y-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-800">
                                        Latest Stable
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">{release.tag_name}</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Released</div>
                                            {new Date(release.published_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Tag size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Branch</div>
                                            Production Stable
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={release.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold hover:border-blue-500 transition-all shadow-sm"
                                >
                                    View on GitHub <Github size={18} />
                                </a>
                            </div>

                            <div className="prose prose-slate dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:tracking-tighter
                                prose-p:text-lg prose-p:text-slate-600 dark:prose-p:text-slate-400
                                prose-strong:text-slate-900 dark:prose-strong:text-white
                                prose-li:text-lg
                                prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none
                            ">
                                <h3 className="text-2xl font-black tracking-tighter mb-8">What's New</h3>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {release.body}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-500">Failed to load latest release info. Please check GitHub.</p>
                        </div>
                    )}
                </div>

                <div className="mt-32 text-center w-full max-w-4xl border-t border-slate-200 dark:border-slate-800 pt-16">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-12">Advanced Tech Stack</h3>
                    <div className="flex flex-wrap items-center justify-center gap-12 font-black text-2xl tracking-tighter text-slate-300 dark:text-slate-800">
                        <span className="hover:text-blue-500 transition-colors cursor-default">RUST</span>
                        <span className="hover:text-blue-500 transition-colors cursor-default">EGUI</span>
                        <span className="hover:text-blue-500 transition-colors cursor-default">NEXT.JS</span>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function DownloadCard({ icon, title, subtitle, href, loading, color }: { icon: any, title: string, subtitle: string, href: string, loading: boolean, color: string }) {
    return (
        <a
            href={href}
            className={`
                flex flex-col items-center p-10 rounded-[2.5rem] border transition-all duration-300
                ${loading ? 'animate-pulse pointer-events-none' : 'hover:-translate-y-2'}
                bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)]
            `}
        >
            <div className={`mb-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 ${color} shadow-sm`}>
                {icon}
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-2 text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-10">{subtitle}</p>
            <div className="mt-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl text-sm font-black flex items-center gap-2 group shadow-xl">
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                Download Now
            </div>
        </a>
    )
}
