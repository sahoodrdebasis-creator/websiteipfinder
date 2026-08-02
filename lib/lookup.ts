import dns from "dns";
import http from "http";
import https from "https";
import type {
  ConnectionDetails,
  DnsRecords,
  HostingDetails,
  LookupResult,
  WhoisDetails,
} from "../src/types";

const dnsPromises = dns.promises;

export interface LookupSuccessResponse {
  success: true;
  data: LookupResult;
}

export interface LookupErrorResponse {
  success: false;
  status: number;
  error: string;
}

export type LookupResponse = LookupSuccessResponse | LookupErrorResponse;

export function sanitizeInput(input: string): string {
  let cleaned = input.trim();

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    try {
      const urlObj = new URL(cleaned);
      cleaned = urlObj.hostname;
    } catch {
      cleaned = cleaned.replace(/^https?:\/\//i, "");
    }
  }

  cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0].split(":")[0];
  return cleaned.toLowerCase();
}

export function isValidDomainOrIP(hostname: string): boolean {
  if (!hostname || hostname.length > 253) return false;

  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(hostname)) return true;

  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(hostname);
}

async function fetchDnsRecords(hostname: string): Promise<DnsRecords> {
  const records: DnsRecords = {
    A: [],
    AAAA: [],
    MX: [],
    NS: [],
    CNAME: [],
    TXT: [],
  };

  const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
  if (isIP) {
    records.A = [hostname];
    try {
      const hostnames = await dnsPromises.reverse(hostname);
      if (hostnames && hostnames.length > 0) {
        records.CNAME = hostnames;
      }
    } catch {
      // Reverse DNS failed, ignore
    }
    return records;
  }

  try {
    records.A = await dnsPromises.resolve4(hostname);
  } catch {
    try {
      const lookupResult = await dnsPromises.lookup(hostname);
      if (lookupResult && lookupResult.address) {
        records.A = [lookupResult.address];
      }
    } catch {
      records.A = [];
    }
  }

  try {
    records.AAAA = await dnsPromises.resolve6(hostname);
  } catch {
    records.AAAA = [];
  }

  try {
    const mx = await dnsPromises.resolveMx(hostname);
    records.MX = mx.sort((a, b) => a.priority - b.priority);
  } catch {
    records.MX = [];
  }

  try {
    records.NS = await dnsPromises.resolveNs(hostname);
  } catch {
    records.NS = [];
  }

  try {
    records.CNAME = await dnsPromises.resolveCname(hostname);
  } catch {
    records.CNAME = [];
  }

  try {
    const txtRaw = await dnsPromises.resolveTxt(hostname);
    records.TXT = txtRaw.map((chunks) => chunks.join(" "));
  } catch {
    records.TXT = [];
  }

  return records;
}

async function fetchIpGeo(ip: string): Promise<HostingDetails> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://ipwho.is/${ip}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success !== false) {
        return {
          ip: data.ip || ip,
          country: data.country || "Unknown",
          countryCode: data.country_code || "",
          flag: data.flag?.emoji || "🌐",
          flagUrl: data.flag?.img || "",
          region: data.region || "",
          city: data.city || "",
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          isp: data.connection?.isp || data.connection?.org || "Unknown ISP",
          org: data.connection?.org || data.connection?.isp || "Unknown Org",
          asn: data.connection?.asn ? `AS${data.connection.asn}` : "",
          timezone: data.timezone?.id || data.timezone?.utc || "UTC",
          timeCurrent: data.timezone?.current_time || "",
        };
      }
    }
  } catch (err) {
    console.warn("ipwho.is failed, trying fallback ip-api.com", err);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,timezone,isp,org,as,query`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === "success") {
        return {
          ip: data.query || ip,
          country: data.country || "Unknown",
          countryCode: data.countryCode || "",
          flag: getCountryEmoji(data.countryCode),
          flagUrl: "",
          region: data.regionName || "",
          city: data.city || "",
          latitude: data.lat || 0,
          longitude: data.lon || 0,
          isp: data.isp || "Unknown ISP",
          org: data.org || "Unknown Org",
          asn: data.as || "",
          timezone: data.timezone || "UTC",
          timeCurrent: "",
        };
      }
    }
  } catch (err) {
    console.warn("ip-api failed", err);
  }

  return {
    ip,
    country: "Unknown",
    countryCode: "",
    flag: "🌐",
    flagUrl: "",
    region: "",
    city: "",
    latitude: 0,
    longitude: 0,
    isp: "Unknown ISP",
    org: "Unknown Org",
    asn: "",
    timezone: "UTC",
    timeCurrent: "",
  };
}

function getCountryEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return "🌐";

  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

export async function fetchWhoisInfo(domain: string): Promise<WhoisDetails> {
  const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain);
  const endpoint = isIP
    ? `https://rdap.org/ip/${domain}`
    : `https://rdap.org/domain/${domain}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/rdap+json, application/json" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      let registrar = "Unknown Registrar";
      let creationDate = "";
      let expirationDate = "";
      let updatedDate = "";
      let status: string[] = [];
      const nameServers: string[] = [];

      if (Array.isArray(data.entities)) {
        for (const entity of data.entities) {
          if (Array.isArray(entity.roles) && entity.roles.includes("registrar")) {
            if (entity.vcardArray && Array.isArray(entity.vcardArray[1])) {
              const fnEntry = entity.vcardArray[1].find(
                (item: any) => item[0] === "fn"
              );
              if (fnEntry && fnEntry[3]) {
                registrar = fnEntry[3];
                break;
              }
            }
            if (entity.handle) {
              registrar = entity.handle;
            }
          }
        }
      }

      if (Array.isArray(data.events)) {
        for (const ev of data.events) {
          if (ev.eventAction === "registration") {
            creationDate = ev.eventDate;
          } else if (
            ev.eventAction === "expiration" ||
            ev.eventAction === "registrar expiration"
          ) {
            expirationDate = ev.eventDate;
          } else if (
            ev.eventAction === "last changed" ||
            ev.eventAction === "last update"
          ) {
            updatedDate = ev.eventDate;
          }
        }
      }

      if (Array.isArray(data.status)) {
        status = data.status;
      }

      if (Array.isArray(data.nameservers)) {
        for (const ns of data.nameservers) {
          if (ns.ldhName) {
            nameServers.push(ns.ldhName);
          }
        }
      }

      return {
        success: true,
        registrar: registrar || "Standard Domain Registry",
        creationDate: creationDate ? new Date(creationDate).toISOString() : null,
        expirationDate: expirationDate ? new Date(expirationDate).toISOString() : null,
        updatedDate: updatedDate ? new Date(updatedDate).toISOString() : null,
        status: status.length > 0 ? status : ["active"],
        nameServers,
        rawJson: JSON.stringify(data, null, 2),
      };
    }
  } catch (err) {
    console.warn("RDAP lookup error", err);
  }

  return {
    success: false,
    registrar: "Public Domain Registry",
    creationDate: null,
    expirationDate: null,
    updatedDate: null,
    status: ["active"],
    nameServers: [],
    rawJson: "{}",
  };
}

async function testHttpConnection(hostname: string): Promise<ConnectionDetails> {
  const startTime = Date.now();
  return new Promise<{ latencyMs: number; status: number; server: string; headers: Record<string, string> }>((resolve) => {
    const req = https.request(
      {
        host: hostname,
        port: 443,
        path: "/",
        method: "HEAD",
        timeout: 3000,
        headers: {
          "User-Agent": "Website-IP-Finder-Bot/1.0",
        },
      },
      (res) => {
        const latencyMs = Date.now() - startTime;
        const headers: Record<string, string> = {};
        if (res.headers.server) headers["server"] = String(res.headers.server);
        if (res.headers["content-type"]) headers["content-type"] = String(res.headers["content-type"]);
        if (res.headers["strict-transport-security"]) headers["hsts"] = "Enabled";
        if (res.headers["x-frame-options"]) headers["x-frame-options"] = String(res.headers["x-frame-options"]);

        resolve({
          latencyMs,
          status: res.statusCode || 200,
          server: (res.headers.server as string) || "Standard Web Server",
          headers,
        });
      }
    );

    req.on("error", () => {
      const httpReq = http.request(
        {
          host: hostname,
          port: 80,
          path: "/",
          method: "HEAD",
          timeout: 3000,
        },
        (httpRes) => {
          resolve({
            latencyMs: Date.now() - startTime,
            status: httpRes.statusCode || 200,
            server: (httpRes.headers.server as string) || "Standard Server",
            headers: {},
          });
        }
      );
      httpReq.on("error", () => {
        resolve({
          latencyMs: -1,
          status: 0,
          server: "N/A",
          headers: {},
        });
      });
      httpReq.end();
    });

    req.end();
  });
}

export async function runLookup(rawQuery: string): Promise<LookupResponse> {
  const cleanDomain = sanitizeInput(rawQuery);

  if (!cleanDomain || !isValidDomainOrIP(cleanDomain)) {
    return {
      success: false,
      status: 400,
      error: "Invalid URL or domain name. Please enter a valid website (e.g. google.com or github.com)",
    };
  }

  try {
    const dnsRecords = await fetchDnsRecords(cleanDomain);
    const primaryIp =
      dnsRecords.A[0] || dnsRecords.AAAA[0] || (isValidDomainOrIP(cleanDomain) ? cleanDomain : null);

    if (!primaryIp && dnsRecords.CNAME.length === 0) {
      return {
        success: false,
        status: 404,
        error: `Could not resolve IP address for domain "${cleanDomain}". Please double-check the domain spelling.`,
      };
    }

    const targetIp = primaryIp || cleanDomain;
    const [geoInfo, whoisInfo, connInfo] = await Promise.all([
      fetchIpGeo(targetIp),
      fetchWhoisInfo(cleanDomain),
      testHttpConnection(cleanDomain),
    ]);

    const data: LookupResult = {
      success: true,
      domain: cleanDomain,
      primaryIp: targetIp,
      dns: dnsRecords,
      hosting: geoInfo,
      whois: whoisInfo,
      connection: connInfo,
      timestamp: new Date().toISOString(),
    };

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: "An unexpected error occurred while analyzing the target domain. " + (error.message || ""),
    };
  }
}
