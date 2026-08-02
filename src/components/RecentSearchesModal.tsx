import React from "react";
import { History, X, Trash2, ArrowUpRight, Clock, Download, Globe } from "lucide-react";
import { HistoryItem, LookupResult } from "../types";

interface RecentSearchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectDomain: (domain: string) => void;
  onClearHistory: () => void;
  currentResult: LookupResult | null;
  isDarkMode: boolean;
}

export const RecentSearchesModal: React.FC<RecentSearchesModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDomain,
  onClearHistory,
  currentResult,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const handleExportJSON = () => {
    if (!currentResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentResult, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentResult.domain}-network-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-xl rounded-3xl p-6 border shadow-2xl transition-all duration-300 max-h-[85vh] flex flex-col ${
          isDarkMode ? "glass-panel border-cyan-500/30 text-slate-100" : "glass-panel-light border-slate-300 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Search History & Tools</h3>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Saved network target lookups ({history.length})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl hover:bg-slate-800 transition-colors ${
              isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Current Report Bar */}
        {currentResult && (
          <div className="my-4 p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Export analysis for <span className="font-mono text-cyan-300">{currentResult.domain}</span></span>
            </div>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>
        )}

        {/* List of items */}
        <div className="flex-1 overflow-y-auto my-2 space-y-2 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-medium">
              No recent searches recorded yet. Try looking up a domain!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectDomain(item.domain);
                  onClose();
                }}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isDarkMode
                    ? "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-cyan-500/40"
                    : "bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300 shadow-sm"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-400 font-mono group-hover:underline">
                      {item.domain}
                    </span>
                    <span className="text-xs">{item.flag || "🌐"}</span>
                    <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {item.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span>IP: {item.primaryIp}</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" /> {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl text-slate-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
