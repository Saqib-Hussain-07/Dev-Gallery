import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/schemas";
import { portfolios } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const portfolio = portfolios.find((p) => p.id === parsed.data.portfolioId);
  if (!portfolio) {
    return NextResponse.json({ error: "Unknown portfolio" }, { status: 404 });
  }

  // Stub: in production this hands off to a transactional email provider
  // (Resend/Postmark) or queues a notification — never sends synchronously
  // from a Route Handler for anything that could be slow or flaky, per the
  // same architectural rule §1.1 applies to screenshot/AI calls.
  console.log(`[contact] message for ${portfolio.owner.displayName}:`, parsed.data);

  return NextResponse.json({
    ok: true,
    message: `Message sent to ${portfolio.owner.displayName}. They'll reply directly to your email.`,
  });
}
