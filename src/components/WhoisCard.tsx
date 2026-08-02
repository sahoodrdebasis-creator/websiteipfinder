import React, { useState } from "react";
import {
  Shield,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { WhoisDetails } from "../types";

interface WhoisCardProps {
  whois: WhoisDetails;
  domain: string;
  isDarkMode: boolean;
  onFetchWhois?: () => void;
}

export const WhoisCard: React.FC<WhoisCardProps> = ({
  whois,
  domain,
  isDarkMode,
}) => {
  const [showRawJson, setShowRawJson] = useState(false);

  // Calculate domain age & expiration countdown
  let creationFormatted = "Not Available";
  let expiryFormatted = "Not Available";
  let daysRemaining: number | null = null;

  if (whois.creationDate) {
    try {
      creationFormatted = new Date(whois.creationDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      creationFormatted = whois.creationDate;
    }
  }

  if (whois.expirationDate) {
    try {
      const expDate = new Date(whois.expirationDate);
      expiryFormatted = expDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const diffTime = expDate.getTime() - new Date().getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      expiryFormatted = whois.expirationDate;
    }
  }

  return (
    <div
      className={`rounded-3xl p-6 border transition-all duration-300 ${
        isDarkMode
          ? "glass-panel border-purple-500/20 shadow-xl"
          : "glass-panel-light border-slate-200 shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300">
              WHOIS Domain Registry Details
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Registrar Ownership, Creation & Expiration Timestamps
            </p>
          </div>
        </div>

        {/* Action button to expand RDAP raw JSON */}
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isDarkMode
              ? "bg-slate-800 hover:bg-slate-700 text-purple-300 border-purple-500/30"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>{showRawJson ? "Hide Raw Data" : "Inspect Raw RDAP"}</span>
          {showRawJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {/* Registrar */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`text-[11px] font-semibold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Domain Registrar
            </span>
            <Building className="w-4 h-4 text-purple-400" />
          </div>
          <div className={`text-base font-bold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
            {whois.registrar || "Public Registrar"}
          </div>
          <span className="text-[11px] text-purple-400 font-medium">
            ICANN Accredited
          </span>
        </div>

        {/* Creation Date */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`text-[11px] font-semibold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Registered On
            </span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className={`text-base font-bold font-mono ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
            {creationFormatted}
          </div>
          <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Creation Date
          </span>
        </div>

        {/* Expiry Date */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`text-[11px] font-semibold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Expiration Date
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-base font-bold font-mono ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
            {expiryFormatted}
          </div>
          {daysRemaining !== null && (
            <span
              className={`text-[11px] font-bold ${
                daysRemaining < 30
                  ? "text-rose-400"
                  : daysRemaining < 180
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
            </span>
          )}
        </div>
      </div>

      {/* Domain Status Flags */}
      {whois.status && whois.status.length > 0 && (
        <div className="mb-4">
          <span className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            ICANN Domain Status Flags
          </span>
          <div className="flex flex-wrap gap-2">
            {whois.status.map((st, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border ${
                  isDarkMode
                    ? "bg-slate-900/80 text-cyan-300 border-slate-800"
                    : "bg-slate-100 text-indigo-700 border-slate-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{st}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Raw RDAP / WHOIS Inspector */}
      {showRawJson && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
            <span>RDAP Raw Response ({domain})</span>
            <a
              href={`https://rdap.org/domain/${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1"
            >
              rdap.org <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <pre className="text-cyan-300 leading-relaxed">
            {whois.rawJson || "No raw RDAP data returned."}
          </pre>
        </div>
      )}
    </div>
  );
};
