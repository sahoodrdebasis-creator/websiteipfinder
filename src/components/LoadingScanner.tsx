import React, { useEffect, useState } from "react";
import { Radar, Server, Shield, Globe2 } from "lucide-react";

interface LoadingScannerProps {
  domain: string;
  isDarkMode: boolean;
}

const STEPS = [
  { text: "Resolving A, MX & NS DNS Records...", icon: Server },
  { text: "Tracing IP Address & Geolocation Coordinates...", icon: Globe2 },
  { text: "Analyzing ISP, ASN & Network Host Organization...", icon: Radar },
  { text: "Querying RDAP / WHOIS Domain Registration Details...", icon: Shield },
];

export const LoadingScanner: React.FC<LoadingScannerProps> = ({
  domain,
  isDarkMode,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full max-w-2xl mx-auto my-8 p-8 rounded-3xl border text-center transition-all duration-300 ${
        isDarkMode ? "glass-panel border-cyan-500/20 shadow-2xl" : "glass-panel-light border-indigo-200 shadow-xl"
      }`}
    >
      {/* Central Cyber Radar Scanner Animation */}
      <div className="relative flex items-center justify-center w-28 h-28 mx-auto mb-6">
        {/* Outer Pulsing Rings */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping opacity-75" />
        <div className="absolute -inset-3 rounded-full border border-indigo-500/20 animate-pulse-ring" />
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-400/50 animate-spin-slow" />

        {/* Center Scanner Core */}
        <div
          className={`relative flex items-center justify-center w-20 h-20 rounded-full ${
            isDarkMode ? "bg-slate-900 border border-cyan-500/50" : "bg-white border border-indigo-300"
          } shadow-lg glow-cyan`}
        >
          <Radar className="w-10 h-10 text-cyan-400 animate-spin" />
        </div>
      </div>

      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Scanning Target Network: <span className="font-mono text-cyan-300">{domain}</span>
      </h3>
      <p
        className={`text-xs mt-1.5 ${
          isDarkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Interrogating international DNS servers and WHOIS registries...
      </p>

      {/* Dynamic Steps List */}
      <div className="mt-6 space-y-2.5 max-w-md mx-auto text-left">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.text}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 ${
                isCurrent
                  ? isDarkMode
                    ? "bg-slate-800/90 border-cyan-500/50 text-cyan-300 glow-cyan"
                    : "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm"
                  : isDone
                  ? isDarkMode
                    ? "bg-slate-900/50 border-slate-800 text-emerald-400"
                    : "bg-slate-100 border-slate-200 text-emerald-600"
                  : isDarkMode
                  ? "bg-slate-900/20 border-slate-800/50 text-slate-600"
                  : "bg-slate-50 border-slate-200/50 text-slate-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-lg ${
                  isCurrent
                    ? "bg-cyan-500/20 text-cyan-400 animate-pulse"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-800/20 text-slate-500"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="flex-1">{step.text}</span>
              {isDone && <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">OK</span>}
              {isCurrent && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
