import React, { useState } from "react";
import {
  Copy,
  Check,
  Globe2,
  Server,
  Zap,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import { LookupResult } from "../types";

interface IpOverviewCardProps {
  data: LookupResult;
  isDarkMode: boolean;
  onCopyText: (text: string, label: string) => void;
}

export const IpOverviewCard: React.FC<IpOverviewCardProps> = ({
  data,
  isDarkMode,
  onCopyText,
}) => {
  const [copiedIp, setCopiedIp] = useState(false);

  const handleCopyIp = () => {
    onCopyText(data.primaryIp, "Primary IP Address");
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const latency = data.connection.latencyMs;
  const latencyBadgeColor =
    latency < 0
      ? "bg-slate-700/30 text-slate-400 border-slate-600"
      : latency < 100
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : latency < 300
      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
      : "bg-rose-500/10 text-rose-400 border-rose-500/30";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
        isDarkMode
          ? "glass-panel border-cyan-500/30 shadow-2xl glow-blue"
          : "glass-panel-light border-indigo-200 shadow-xl"
      }`}
    >
      {/* Accent Top Bar Glow */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Primary Domain & IP Highlight */}
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Globe2 className="w-3.5 h-3.5" /> Target Domain
            </span>
            <a
              href={`https://${data.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 text-xs font-medium hover:underline ${
                isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              https://{data.domain} <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="space-y-1">
              <span className={`text-xs uppercase tracking-wider font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Resolved IPv4 Address
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-white">
                {data.primaryIp}
              </h2>
            </div>

            {/* Copy IP Button */}
            <button
              onClick={handleCopyIp}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border transition-all duration-200 shadow-md transform active:scale-95 ${
                copiedIp
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : isDarkMode
                  ? "bg-slate-800/90 hover:bg-slate-800 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 glow-cyan"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500"
              }`}
              title="Copy IP Address"
            >
              {copiedIp ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy IP</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Sub-Stats */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            {/* Country & Flag */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                isDarkMode ? "bg-slate-800/60 border-slate-700/80 text-slate-200" : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <span className="text-base">{data.hosting.flag || "🌐"}</span>
              <span className="font-semibold">{data.hosting.country || "Unknown Country"}</span>
              {data.hosting.city && (
                <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  ({data.hosting.city})
                </span>
              )}
            </div>

            {/* ISP Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                isDarkMode ? "bg-slate-800/60 border-slate-700/80 text-slate-200" : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold">{data.hosting.isp || "Unknown ISP"}</span>
            </div>

            {/* Ping Latency */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${latencyBadgeColor}`}>
              <Zap className="w-3.5 h-3.5" />
              <span className="font-mono font-bold">
                {latency >= 0 ? `${latency} ms Response` : "Ping Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Diagnostic Matrix */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
          {/* Server software */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isDarkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`text-[11px] font-medium uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Web Server
              </span>
              <Server className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className={`text-sm font-bold font-mono ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
              {data.connection.server || "Standard Web Server"}
            </div>
          </div>

          {/* Location & ASN */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isDarkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`text-[11px] font-medium uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Autonomous System (ASN)
              </span>
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className={`text-sm font-bold font-mono ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
              {data.hosting.asn || "N/A"}
            </div>
          </div>

          {/* Timezone */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isDarkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`text-[11px] font-medium uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Timezone
              </span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className={`text-sm font-bold font-mono ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
              {data.hosting.timezone || "UTC"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
