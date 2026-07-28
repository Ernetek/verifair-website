import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !body.name || !body.company || !body.email || !body.industry || !body.message || !body.consent) {
    return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
  }

  if (process.env.TURNSTILE_SECRET_KEY && body.turnstileToken) {
    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: body.turnstileToken
      })
    });
    const result = (await verification.json()) as { success?: boolean };
    if (!result.success) {
      return NextResponse.json({ error: "Turnstile verification failed." }, { status: 403 });
    }
  }

  console.info("VerifAir enquiry received", {
    company: body.company,
    industry: body.industry,
    location: body.location,
    preferredContact: body.preferredContact
  });

  return NextResponse.json({ ok: true });
}
