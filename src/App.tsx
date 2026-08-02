import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { NetworkBackground } from "./components/NetworkBackground";
import { SearchBar } from "./components/SearchBar";
import { LoadingScanner } from "./components/LoadingScanner";
import { IpOverviewCard } from "./components/IpOverviewCard";
import { DnsRecordsCard } from "./components/DnsRecordsCard";
import { HostingDetailsCard } from "./components/HostingDetailsCard";
import { WhoisCard } from "./components/WhoisCard";
import { RecentSearchesModal } from "./components/RecentSearchesModal";
import { Toast } from "./components/Toast";
import { LookupResult, HistoryItem } from "./types";
import { AlertTriangle, RefreshCw, Sparkles, Terminal } from "lucide-react";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [targetDomain, setTargetDomain] = useState<string>("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load saved history and theme from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("ip_finder_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedTheme = localStorage.getItem("ip_finder_theme");
      if (savedTheme) {
        setIsDarkMode(savedTheme === "dark");
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ip_finder_theme", next ? "dark" : "light");
      } catch {}
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Main Lookup Function
  const handleSearch = useCallback(
    async (domainQuery: string) => {
      if (!domainQuery) return;
      setIsLoading(true);
      setError(null);
      setTargetDomain(domainQuery);

      try {
        const response = await fetch(
          `/api/lookup?domain=${encodeURIComponent(domainQuery)}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Failed to resolve domain network records."
          );
        }

        setResult(data);

        // Save to History
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          domain: data.domain,
          primaryIp: data.primaryIp,
          country: data.hosting.country || "Unknown",
          countryCode: data.hosting.countryCode || "",
          flag: data.hosting.flag || "🌐",
          timestamp: new Date().toISOString(),
        };

        setHistory((prevHistory) => {
          const filtered = prevHistory.filter(
            (h) => h.domain.toLowerCase() !== data.domain.toLowerCase()
          );
          const updated = [newItem, ...filtered].slice(0, 15);
          try {
            localStorage.setItem("ip_finder_history", JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } catch (err: any) {
        console.error("Lookup error:", err);
        setError(
          err.message ||
            "Unable to connect to domain lookup service. Please check target URL."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Trigger initial search for google.com on initial load if no search done yet
  useEffect(() => {
    handleSearch("google.com");
  }, [handleSearch]);

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("ip_finder_history");
    } catch {}
    showToast("Search history cleared.");
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans transition-colors duration-500 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950 ${
        isDarkMode ? "bg-[#05060b] text-slate-200" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Background Ambient Glows */}
      {isDarkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        </>
      )}

      {/* Dynamic Animated Canvas Background */}
      <NetworkBackground isDarkMode={isDarkMode} />

      {/* Header Bar */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Body Layout */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 pb-16">
        {/* Search Input Bar */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
          initialValue={targetDomain}
        />

        {/* Loading State */}
        {isLoading && (
          <LoadingScanner domain={targetDomain} isDarkMode={isDarkMode} />
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div
            className={`w-full max-w-2xl mx-auto my-8 p-6 rounded-3xl border text-center transition-all animate-fadeIn ${
              isDarkMode
                ? "bg-rose-950/40 border-rose-500/30 text-rose-200"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Lookup Unsuccessful</h3>
            <p className="text-xs mt-1.5 opacity-90 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => handleSearch(targetDomain || "google.com")}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {/* Results Dashboard */}
        {!isLoading && !error && result && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. Primary IP & Quick Diagnostics Banner */}
            <IpOverviewCard
              data={result}
              isDarkMode={isDarkMode}
              onCopyText={handleCopyText}
            />

            {/* 2. Grid of Details: DNS Records & Hosting/ISP */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DNS Records */}
              <DnsRecordsCard
                dns={result.dns}
                isDarkMode={isDarkMode}
                onCopyText={handleCopyText}
              />

              {/* Hosting & Geolocation */}
              <HostingDetailsCard
                hosting={result.hosting}
                isDarkMode={isDarkMode}
                onCopyText={handleCopyText}
              />
            </div>

            {/* 3. WHOIS Registry Inspector */}
            <WhoisCard
              whois={result.whois}
              domain={result.domain}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 w-full border-t py-6 text-center text-xs transition-colors ${
          isDarkMode
            ? "border-slate-800/80 bg-slate-950/60 text-slate-500"
            : "border-slate-200 bg-white/60 text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-mono">Website IP Finder v2.0</span>
          </div>
          <p>
            Powered by Node.js DNS, IP Geolocation & RDAP Protocol
          </p>
        </div>
      </footer>

      {/* History Modal */}
      <RecentSearchesModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDomain={handleSearch}
        onClearHistory={handleClearHistory}
        currentResult={result}
        isDarkMode={isDarkMode}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
