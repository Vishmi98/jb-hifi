import { NextResponse } from "next/server";

import { EmailService } from "@/services/email.services";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? body.email
      : undefined;

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 },
    );
  }

  const sent = await EmailService.sendPromotionEmail(email.trim());

  if (!sent) {
    return NextResponse.json(
      { error: "The promotion email could not be sent" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Promotion email sent" });
}