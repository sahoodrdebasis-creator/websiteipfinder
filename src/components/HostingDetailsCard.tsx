import React from "react";
import { Building2, Globe, MapPin, Radio, Compass, Copy, Check } from "lucide-react";
import { HostingDetails } from "../types";

interface HostingDetailsCardProps {
  hosting: HostingDetails;
  isDarkMode: boolean;
  onCopyText: (text: string, label: string) => void;
}

export const HostingDetailsCard: React.FC<HostingDetailsCardProps> = ({
  hosting,
  isDarkMode,
  onCopyText,
}) => {
  const [copied, setCopied] = React.useState(false);

  const mapUrl =
    hosting.latitude && hosting.longitude
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${hosting.longitude - 0.15}%2C${hosting.latitude - 0.15}%2C${hosting.longitude + 0.15}%2C${hosting.latitude + 0.15}&layer=mapnik&marker=${hosting.latitude}%2C${hosting.longitude}`
      : null;

  const handleCopyGeo = () => {
    const text = `${hosting.city}, ${hosting.region}, ${hosting.country} (ISP: ${hosting.isp}, Lat/Lon: ${hosting.latitude}, ${hosting.longitude})`;
    onCopyText(text, "Hosting Geolocation");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-3xl p-6 border transition-all duration-300 ${
        isDarkMode
          ? "glass-panel border-cyan-500/20 shadow-xl"
          : "glass-panel-light border-slate-200 shadow-md"
      }`}
    >
      {/* Card Title Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
              Hosting & ISP Infrastructure
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Physical Server Location, Autonomous Network & ISP Provider
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyGeo}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            copied
              ? "bg-emerald-600 text-white border-emerald-500"
              : isDarkMode
              ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Details"}</span>
        </button>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
        {/* Country & Flag */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`text-[11px] font-semibold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Country
            </span>
            <span className="text-xl">{hosting.flag || "🌐"}</span>
          </div>
          <div className={`text-base font-bold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
            {hosting.country || "Unknown Country"}
          </div>
          {hosting.countryCode && (
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              Code: {hosting.countryCode}
            </span>
          )}
        </div>

        {/* ISP */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`text-[11px] font-semibold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Internet Service Provider
            </span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className={`text-base font-bold truncate ${isDarkMode ? "text-slate-100" : "text-slate-800"}`} title={hosting.isp}>
            {hosting.isp || "Unknown ISP"}
          </div>
          <span className="text-[11px] font-mono text-indigo-400 font-medium">
            {hosting.asn || "Standard Network"}
          </span>
        </div>

        {/* Organization */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`text-[11px] font-semibold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Organization Name
            </span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className={`text-base font-bold truncate ${isDarkMode ? "text-slate-100" : "text-slate-800"}`} title={hosting.org}>
            {hosting.org || hosting.isp || "N/A"}
          </div>
          <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Host Owner
          </span>
        </div>

        {/* City & Region */}
        <div
          className={`p-4 rounded-2xl border ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`text-[11px] font-semibold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              City & Region
            </span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-base font-bold truncate ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
            {hosting.city || hosting.region || "Unknown City"}
          </div>
          <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            {hosting.region || "State/Province"}
          </span>
        </div>
      </div>

      {/* Embedded Map Section */}
      {mapUrl && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-700/50 relative">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Compass className="w-4 h-4 text-cyan-400" /> Server Map Location
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              Lat: {hosting.latitude.toFixed(4)}, Lon: {hosting.longitude.toFixed(4)}
            </span>
          </div>
          <iframe
            title="Hosting Map"
            width="100%"
            height="220"
            frameBorder="0"
            scrolling="no"
            src={mapUrl}
            className="w-full h-[220px] filter brightness-90 contrast-105"
          />
        </div>
      )}
    </div>
  );
};
