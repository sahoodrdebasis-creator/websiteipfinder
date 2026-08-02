import React from "react";
import { Network, Moon, Sun, History, ShieldCheck } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-6 pb-2">
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl ${
          isDarkMode ? "glass-panel shadow-2xl" : "glass-panel-light shadow-lg"
        } transition-all duration-300`}
      >
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 blur-sm opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-ring"></div>
            <div
              className={`relative flex items-center justify-center w-12 h-12 rounded-xl ${
                isDarkMode ? "bg-slate-900 text-cyan-400" : "bg-white text-indigo-600"
              } shadow-inner border border-cyan-500/30`}
            >
              <Network className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Website IP Finder
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> V2.0 Live
              </span>
            </div>
            <p
              className={`text-xs mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              DNS Analyzer • ISP & Geolocation • WHOIS Registry Inspector
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Recent Searches Drawer Toggle */}
          <button
            onClick={onOpenHistory}
            className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 ${
              isDarkMode
                ? "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-indigo-500/50"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 hover:border-indigo-400"
            }`}
            title="View Recent Searches"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span className="hidden xs:inline">Recent</span>
            {historyCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-indigo-600 text-white shadow-sm">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              isDarkMode
                ? "bg-slate-800/80 hover:bg-slate-800 text-yellow-400 border-slate-700/80 hover:border-yellow-500/40"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 hover:border-slate-400"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Cyber Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
