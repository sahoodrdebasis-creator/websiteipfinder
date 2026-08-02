import React, { useState } from "react";
import { Search, Globe, X, Sparkles, AlertCircle } from "lucide-react";

interface SearchBarProps {
  onSearch: (domain: string) => void;
  isLoading: boolean;
  isDarkMode: boolean;
  initialValue?: string;
}

const PRESET_DOMAINS = [
  "google.com",
  "github.com",
  "cloudflare.com",
  "wikipedia.org",
  "openai.com",
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  isDarkMode,
  initialValue = "",
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setErrorMsg("Please enter a website URL or IP address (e.g., google.com)");
      return;
    }

    // Basic client validation
    const sanitized = trimmed
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      .split("?")[0]
      .split("#")[0];

    if (sanitized.length < 3) {
      setErrorMsg("Domain name is too short. Please enter a valid URL.");
      return;
    }

    onSearch(trimmed);
  };

  const handlePresetClick = (domain: string) => {
    setInputValue(domain);
    setErrorMsg(null);
    onSearch(domain);
  };

  const handleClear = () => {
    setInputValue("");
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow border background */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 opacity-60 group-hover:opacity-100 blur-md transition duration-300"></div>

        <div
          className={`relative flex items-center p-2 rounded-2xl border transition-all duration-300 ${
            isDarkMode
              ? "bg-slate-900/90 border-slate-700/80 shadow-2xl focus-within:border-cyan-400"
              : "bg-white/95 border-slate-300 shadow-xl focus-within:border-indigo-500"
          }`}
        >
          {/* Globe Icon */}
          <div className="pl-3.5 pr-2 text-cyan-400 flex items-center">
            <Globe className="w-5 h-5 animate-spin-slow" />
          </div>

          {/* Input field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="Enter website URL or domain (e.g., google.com, github.com)..."
            disabled={isLoading}
            className={`w-full py-3 px-2 text-sm md:text-base font-medium bg-transparent border-none outline-none focus:outline-none ${
              isDarkMode ? "text-slate-100 placeholder-slate-500" : "text-slate-800 placeholder-slate-400"
            }`}
          />

          {/* Clear button */}
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className={`p-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors ${
                isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Button with hover animation */}
          <button
            type="submit"
            disabled={isLoading}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
              isLoading
                ? "bg-indigo-600"
                : "bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 hover:shadow-cyan-500/25 glow-cyan"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-200 opacity-80" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Input Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 mt-2.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Preset Domain Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
        <span
          className={`text-xs font-medium ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Popular targets:
        </span>
        {PRESET_DOMAINS.map((domain) => (
          <button
            key={domain}
            onClick={() => handlePresetClick(domain)}
            disabled={isLoading}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 ${
              isDarkMode
                ? "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border-slate-700/60 hover:border-cyan-500/40"
                : "bg-white/80 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 border-slate-200 hover:border-indigo-300 shadow-sm"
            }`}
          >
            {domain}
          </button>
        ))}
      </div>
    </div>
  );
};
