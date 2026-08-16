import { NextResponse } from "next/server";
import { getWallfolioPortfolios } from "@/lib/wallfolio-sync";

/**
 * GET /api/wallfolio/sync
 * Returns the parsed list of portfolios from the Wallfolio repository with summary metrics.
 */
export async function GET() {
  try {
    const portfolios = await getWallfolioPortfolios(false);
    return NextResponse.json({
      success: true,
      total: portfolios.length,
      source: "https://github.com/Saqib-Hussain-07/Wallfolio",
      portfolios,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wallfolio/sync
 * Forces a fresh fetch from GitHub and clears memory cache.
 */
export async function POST() {
  try {
    const portfolios = await getWallfolioPortfolios(true);
    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${portfolios.length} portfolios from Wallfolio repository.`,
      total: portfolios.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
