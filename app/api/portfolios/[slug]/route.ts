import { NextRequest, NextResponse } from "next/server";
import { getPortfolioBySlug, getSimilarPortfolios } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const portfolio = getPortfolioBySlug(slug);

  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  const similar = getSimilarPortfolios(portfolio);

  return NextResponse.json({ portfolio, similar });
}
