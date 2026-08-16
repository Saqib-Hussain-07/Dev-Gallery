import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { reorderProjects } from "@/lib/project-store";

const reorderSchema = z.object({
  portfolioId: z.string().min(1),
  orderedIds: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await reorderProjects(parsed.data.portfolioId, parsed.data.orderedIds);
  return NextResponse.json({ ok: true });
}
