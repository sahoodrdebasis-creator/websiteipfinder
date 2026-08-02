import React, { useState } from "react";
import { Server, Copy, Check, Info, Layers, Mail, Globe, Shield } from "lucide-react";
import { DnsRecords } from "../types";

interface DnsRecordsCardProps {
  dns: DnsRecords;
  isDarkMode: boolean;
  onCopyText: (text: string, label: string) => void;
}

type RecordType = "ALL" | "A" | "MX" | "NS" | "CNAME" | "AAAA" | "TXT";

export const DnsRecordsCard: React.FC<DnsRecordsCardProps> = ({
  dns,
  isDarkMode,
  onCopyText,
}) => {
  const [activeTab, setActiveTab] = useState<RecordType>("ALL");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const totalRecords =
    (dns.A?.length || 0) +
    (dns.AAAA?.length || 0) +
    (dns.MX?.length || 0) +
    (dns.NS?.length || 0) +
    (dns.CNAME?.length || 0) +
    (dns.TXT?.length || 0);

  const handleCopy = (text: string, label: string, key: string) => {
    onCopyText(text, label);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tabs: { type: RecordType; label: string; count: number; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: "ALL", label: "All Records", count: totalRecords, icon: Layers },
    { type: "A", label: "A (IPv4)", count: dns.A?.length || 0, icon: Globe },
    { type: "MX", label: "MX (Mail)", count: dns.MX?.length || 0, icon: Mail },
    { type: "NS", label: "NS (Name Server)", count: dns.NS?.length || 0, icon: Server },
    { type: "CNAME", label: "CNAME", count: dns.CNAME?.length || 0, icon: Info },
    { type: "AAAA", label: "AAAA (IPv6)", count: dns.AAAA?.length || 0, icon: Globe },
    { type: "TXT", label: "TXT", count: dns.TXT?.length || 0, icon: Shield },
  ];

  return (
    <div
      className={`rounded-3xl p-6 border transition-all duration-300 ${
        isDarkMode
          ? "glass-panel border-indigo-500/20 shadow-xl"
          : "glass-panel-light border-slate-200 shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/40">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">
              DNS Records Matrix
            </h3>
          </div>
          <p
            className={`text-xs mt-1 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Authoritative Name Servers & Mapping Configurations ({totalRecords} records found)
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md glow-purple"
                    : isDarkMode
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="mt-5 space-y-4">
        {totalRecords === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm italic">
            No DNS records were found for this target domain.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* A Records */}
            {(activeTab === "ALL" || activeTab === "A") &&
              dns.A?.map((ip, idx) => (
                <DnsRecordItem
                  key={`A-${idx}`}
                  type="A"
                  title="A Record (IPv4)"
                  value={ip}
                  isDarkMode={isDarkMode}
                  onCopy={() => handleCopy(ip, "A Record", `A-${idx}`)}
                  isCopied={copiedIndex === `A-${idx}`}
                  badgeColor="bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                />
              ))}

            {/* MX Records */}
            {(activeTab === "ALL" || activeTab === "MX") &&
              dns.MX?.map((mx, idx) => (
                <DnsRecordItem
                  key={`MX-${idx}`}
                  type="MX"
                  title={`MX Mail Server (Priority ${mx.priority})`}
                  value={mx.exchange}
                  isDarkMode={isDarkMode}
                  onCopy={() => handleCopy(mx.exchange, "MX Record", `MX-${idx}`)}
                  isCopied={copiedIndex === `MX-${idx}`}
                  badgeColor="bg-purple-500/10 text-purple-400 border-purple-500/30"
                  extraBadge={`Priority: ${mx.priority}`}
                />
              ))}

            {/* NS Records */}
            {(activeTab === "ALL" || activeTab === "NS") &&
              dns.NS?.map((ns, idx) => (
                <DnsRecordItem
                  key={`NS-${idx}`}
                  type="NS"
                  title="Name Server (NS)"
                  value={ns}
                  isDarkMode={isDarkMode}
                  onCopy={() => handleCopy(ns, "NS Record", `NS-${idx}`)}
                  isCopied={copiedIndex === `NS-${idx}`}
                  badgeColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                />
              ))}

            {/* CNAME Records */}
            {(activeTab === "ALL" || activeTab === "CNAME") &&
              dns.CNAME?.map((cname, idx) => (
                <DnsRecordItem
                  key={`CNAME-${idx}`}
                  type="CNAME"
                  title="Canonical Name Alias (CNAME)"
                  value={cname}
                  isDarkMode={isDarkMode}
                  onCopy={() => handleCopy(cname, "CNAME Record", `CNAME-${idx}`)}
                  isCopied={copiedIndex === `CNAME-${idx}`}
                  badgeColor="bg-amber-500/10 text-amber-400 border-amber-500/30"
                />
              ))}

            {/* AAAA Records */}
            {(activeTab === "ALL" || activeTab === "AAAA") &&
              dns.AAAA?.map((ipv6, idx) => (
                <DnsRecordItem
                  key={`AAAA-${idx}`}
                  type="AAAA"
                  title="AAAA Record (IPv6)"
                  value={ipv6}
                  isDarkMode={isDarkMode}
                  onCopy={() => handleCopy(ipv6, "AAAA Record", `AAAA-${idx}`)}
                  isCopied={copiedIndex === `AAAA-${idx}`}
                  badgeColor="bg-blue-500/10 text-blue-400 border-blue-500/30"
                />
              ))}

            {/* TXT Records */}
            {(activeTab === "ALL" || activeTab === "TXT") &&
              dns.TXT?.map((txt, idx) => (
                <DnsRecordItem
                  key={`TXT-${idx}`}
                  type="TXT"
                  title="TXT Record"
                  value={txt}
                  isDarkMode={isDarkMode}
                  onCopy={() => handleCopy(txt, "TXT Record", `TXT-${idx}`)}
                  isCopied={copiedIndex === `TXT-${idx}`}
                  badgeColor="bg-slate-500/10 text-slate-300 border-slate-500/30"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface DnsRecordItemProps {
  type: string;
  title: string;
  value: string;
  isDarkMode: boolean;
  onCopy: () => void;
  isCopied: boolean;
  badgeColor: string;
  extraBadge?: string;
}

const DnsRecordItem: React.FC<DnsRecordItemProps> = ({
  type,
  title,
  value,
  isDarkMode,
  onCopy,
  isCopied,
  badgeColor,
  extraBadge,
}) => {
  return (
    <div
      className={`group flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        isDarkMode
          ? "bg-slate-900/60 border-slate-800 hover:border-indigo-500/40"
          : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm"
      }`}
    >
      <div className="space-y-1 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase font-mono border ${badgeColor}`}
          >
            {type}
          </span>
          {extraBadge && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {extraBadge}
            </span>
          )}
          <span
            className={`text-[11px] font-medium ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </span>
        </div>
        <p
          className={`font-mono text-xs sm:text-sm font-semibold break-all ${
            isDarkMode ? "text-slate-100" : "text-slate-800"
          }`}
        >
          {value}
        </p>
      </div>

      <button
        onClick={onCopy}
        className={`shrink-0 p-2 rounded-xl border transition-all duration-200 ${
          isCopied
            ? "bg-emerald-600 text-white border-emerald-500"
            : isDarkMode
            ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-cyan-300"
            : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300"
        }`}
        title="Copy Record"
      >
        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
