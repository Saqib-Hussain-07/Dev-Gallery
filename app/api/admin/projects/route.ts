import { NextRequest, NextResponse } from "next/server";
import { listProjects } from "@/lib/project-store";

export async function GET(req: NextRequest) {
  const portfolioId = req.nextUrl.searchParams.get("portfolioId");
  if (!portfolioId) {
    return NextResponse.json({ error: "portfolioId query param is required" }, { status: 400 });
  }
  const projects = await listProjects(portfolioId);
  return NextResponse.json({ projects });
}
