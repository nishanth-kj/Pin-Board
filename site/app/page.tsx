'use client';

import { useEffect, useState } from 'react';
import {
  Download,
  Github,
  Star,
  GitFork,
  Bug,
  Zap,
  Palette,
  Timer,
  Shield,
  Monitor,
  Save,
} from 'lucide-react';

import Link from 'next/link';
import { Footer } from '../components/footer';
import { Navbar } from '../components/navbar';

interface RepoData {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

interface ReleaseData {
  tag_name: string;
  assets: { download_count: number }[];
}

export default function Home() {
  const [stats, setStats] = useState<RepoData | null>(null);
  const [downloads, setDownloads] = useState<number>(0);
  const [version, setVersion] = useState<string>('v1.0');

  useEffect(() => {
    // Fetch Repo Stats
    fetch('https://api.github.com/repos/nishanth-kj/Pin-Board')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));

    // Fetch Releases for Download Count and Version
    fetch('https://api.github.com/repos/nishanth-kj/Pin-Board/releases')
      .then((res) => res.json())
      .then((data: ReleaseData[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((acc, release) => {
            return acc + release.assets.reduce((sum, asset) => sum + asset.download_count, 0);
          }, 0);
          setDownloads(total);
          // Set version to the latest release tag
          setVersion(data[0].tag_name);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-gray-200 font-sans selection:bg-blue-500/30 transition-colors duration-300 relative overflow-hidden">

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="container mx-auto px-4 py-20 flex flex-col items-center text-center relative z-10 w-full">

        <Navbar />

        {/* Hero */}
        <div className="mb-12 max-w-4xl pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-full text-xs font-semibold text-blue-500 dark:text-blue-400 mb-6 uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> {version} is Live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
            Focus on work.<br />
            <span className="text-slate-500 dark:text-gray-500">Pin your thoughts.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            The minimalist, always-on-top sticky note application.
            Built with Rust for zero latency.
          </p>

          {/* CTA */}
          <div id="download" className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link
              href="/download"
              className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl group"
            >
              <Download className="group-hover:translate-y-0.5 transition-transform" size={20} />
              Download for Desktop
            </Link>
            <Link
              href="/docs"
              className="px-8 py-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full font-bold text-lg transition-all border border-blue-200 dark:border-blue-800 flex items-center justify-center"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/nishanth-kj/Pin-Board"
              className="px-8 py-4 border border-slate-300 dark:border-gray-800 hover:border-slate-400 dark:hover:border-gray-600 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 rounded-full font-bold text-lg transition-all flex items-center gap-2"
            >
              <Github size={20} /> Source
            </a>
          </div>
        </div>

        {/* App Showcase / Live Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-32 relative">
          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Card 1: Note */}
          <div className="bg-yellow-50 dark:bg-yellow-100 text-slate-800 p-6 rounded-lg shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 border-t-8 border-yellow-400 dark:border-yellow-300 min-h-[220px] flex flex-col relative z-10">
            <div className="font-sans font-bold text-xl mb-4 flex justify-between">
              <span>Idea 💡</span>
              <span className="text-slate-400 text-sm">📌</span>
            </div>
            <p className="font-medium text-lg leading-snug font-sans">
              Fix the button bug in the UI header... Done! ✅
            </p>
            <div className="mt-auto pt-4 flex gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-400"></div>
              <div className="w-4 h-4 rounded-full bg-pink-400"></div>
            </div>
          </div>

          {/* Card 2: Timer */}
          <LiveTimerCard />

          {/* Card 3: Note */}
          <div className="bg-pink-50 dark:bg-pink-100 text-slate-800 p-6 rounded-lg shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300 border-t-8 border-pink-400 dark:border-pink-300 min-h-[220px] flex flex-col z-10">
            <div className="font-sans font-bold text-xl mb-4 flex justify-between">
              <span>Meeting</span>
              <span className="text-slate-400 text-sm">📌</span>
            </div>
            <p className="font-medium text-lg leading-snug font-sans">
              Deploy website to GitHub Pages at 3 PM.
            </p>
            <div className="mt-auto pt-4 flex gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl mb-32 border-y border-slate-200 dark:border-gray-800 py-12">
          <StatItem value={stats?.stargazers_count?.toString()} label="GitHub Stars" icon={<Star size={16} className="text-yellow-500" />} />
          <StatItem value={downloads > 0 ? downloads + '+' : '-'} label="Total Downloads" icon={<Download size={16} className="text-blue-500" />} />
          <StatItem value={stats?.forks_count} label="Forks" icon={<GitFork size={16} className="text-purple-500" />} />
          <StatItem value={stats?.open_issues_count} label="Active Issues" icon={<Bug size={16} className="text-red-500" />} />
        </div>

        {/* Features Grid */}
        <div id="features" className="w-full max-w-6xl text-left">
          <h2 className="text-3xl font-bold mb-16 text-slate-900 dark:text-white text-center">Why <span className="text-blue-500">Pin-Board</span>?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="text-yellow-500 dark:text-yellow-400" size={32} />}
              title="Blazing Fast"
              desc="Launch instantly. No Electron, no lag. Native performance on every platform."
            />
            <FeatureCard
              icon={<Palette className="text-pink-500 dark:text-pink-400" size={32} />}
              title="Modern UI"
              desc="Clean, distraction-free design with glassmorphism and opacity controls."
            />
            <FeatureCard
              icon={<Timer className="text-green-500 dark:text-green-400" size={32} />}
              title="Productivity"
              desc="Integrated timers, deadlines, and 'Always on Top' mode to keep you focused."
            />
            <FeatureCard
              icon={<Shield className="text-cyan-500 dark:text-cyan-400" size={32} />}
              title="Privacy First"
              desc="100% Local. No cloud sync, no tracking, no data collection."
            />
            <FeatureCard
              icon={<Save className="text-orange-500 dark:text-orange-400" size={32} />}
              title="Persistence"
              desc="Auto-saves your state. Pick up exactly where you left off."
            />
            <FeatureCard
              icon={<Monitor className="text-purple-500 dark:text-purple-400" size={32} />}
              title="Cross Platform"
              desc="First-class support for Windows, macOS, and Linux."
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatItem({ value, label, icon }: { value?: string | number, label: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center group">
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform">{value ?? '-'}</div>
      <div className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </div>
    </div>
  )
}

function LiveTimerCard() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 dark:bg-gray-800 text-white p-6 rounded-lg shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-slate-700 min-h-[220px] flex flex-col z-20 relative overflow-hidden group">
      {/* Progress Bar background */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-1000 ease-linear"
        style={{ width: `${(timeLeft / 300) * 100}%` }}
      />

      <div className="flex justify-between items-center mb-6">
        <span className="font-mono text-xs text-slate-400">TIMER</span>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-white"
          aria-label={isPlaying ? "Pause Timer" : "Play Timer"}
        >
          {isPlaying ? (
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          ) : (
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
          )}
        </button>
      </div>
      <div className="text-center my-auto">
        <div className={`text-5xl font-mono font-bold tracking-widest text-white tabular-nums transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-50'}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="text-xs text-slate-500 mt-3 uppercase tracking-wider font-bold text-red-400">
          {isPlaying ? "Deadline Approaching" : "Timer Paused"}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="p-8 bg-white dark:bg-gray-900/30 rounded-2xl hover:bg-slate-50 dark:hover:bg-gray-900/60 transition-colors border border-slate-200 dark:border-gray-800/50 hover:border-slate-300 dark:hover:border-gray-700 group shadow-sm dark:shadow-none">
      <div className="mb-4 group-hover:scale-110 transition-transform duration-300 bg-slate-100 dark:bg-gray-800/50 w-16 h-16 rounded-xl flex items-center justify-center border border-slate-200 dark:border-gray-700">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
