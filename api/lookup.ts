import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runLookup } from "../lib/lookup.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const rawDomain = Array.isArray(req.query.domain)
      ? req.query.domain[0]
      : req.query.domain;

    const response = await runLookup(typeof rawDomain === "string" ? rawDomain : "");

    if (!response.success) {
      return res.status(response.status).json({ success: false, error: response.error });
    }

    return res.status(200).json({ success: true, ...response.data });
  } catch (error: any) {
    console.error("Lookup handler runtime error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error occurred while processing the lookup.",
    });
  }
}
