export interface DnsRecords {
  A: string[];
  AAAA: string[];
  MX: { exchange: string; priority: number }[];
  NS: string[];
  CNAME: string[];
  TXT: string[];
}

export interface HostingDetails {
  ip: string;
  country: string;
  countryCode: string;
  flag: string;
  flagUrl?: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  isp: string;
  org: string;
  asn: string;
  timezone: string;
  timeCurrent?: string;
}

export interface WhoisDetails {
  success: boolean;
  registrar: string;
  creationDate: string | null;
  expirationDate: string | null;
  updatedDate: string | null;
  status: string[];
  nameServers: string[];
  rawJson?: string;
}

export interface ConnectionDetails {
  latencyMs: number;
  status: number;
  server: string;
  headers: Record<string, string>;
}

export interface LookupResult {
  success: boolean;
  domain: string;
  primaryIp: string;
  dns: DnsRecords;
  hosting: HostingDetails;
  whois: WhoisDetails;
  connection: ConnectionDetails;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  domain: string;
  primaryIp: string;
  country: string;
  countryCode: string;
  flag: string;
  timestamp: string;
}
