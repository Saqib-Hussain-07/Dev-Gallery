import { NextResponse } from "next/server";
import { technologyFacets } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ technologies: technologyFacets });
}
