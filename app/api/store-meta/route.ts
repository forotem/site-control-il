// פרטי מוצר לכלים המקומיים (שם, מק"ט, מחיר), למשל לניסוח שאלת מלאי לעידן. מוגן במפתח site-leads.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { storeProducts, productName } from "../../data/store-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-leads") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`site-leads:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const p = storeProducts.find((x) => x.slug === req.nextUrl.searchParams.get("slug"));
  if (!p) return NextResponse.json({ error: "no such product" }, { status: 404 });
  return NextResponse.json({ slug: p.slug, name: productName(p), title: p.title, sku: p.sku, price: p.price, url: `https://www.site-control-il.com/store/${p.slug}` });
}
