import { NextRequest } from "next/server";
import { GET as listPortfolios } from "@/app/api/portfolios/route";

// Same underlying contract as GET /api/portfolios (§1.4: "unified search").
// Kept as a distinct route because the real implementation will eventually
// diverge — this one hits Postgres FTS / Typesense (§1.1) while the plain
// list endpoint stays a straightforward filtered read.
export async function GET(req: NextRequest) {
  return listPortfolios(req);
}
