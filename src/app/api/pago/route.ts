import { NextRequest, NextResponse } from "next/server";
import { generateWompiPaymentUrl, calculateDeposit } from "@/lib/wompi";

const LISA_API = process.env.LISA_API_URL!;
const AGENT_ID = process.env.LISA_AGENT_ID!;
const AGENT_TOKEN = process.env.LISA_AGENT_TOKEN!;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { reservationId, totalAmount: bodyTotal, guestEmail: bodyEmail, guestName: bodyName } = body;

  if (!reservationId) {
    return NextResponse.json({ error: "reservationId es requerido" }, { status: 400 });
  }

  let totalAmount = bodyTotal as number | undefined;
  let guestEmail = bodyEmail as string | undefined;
  let guestName = bodyName as string | undefined;

  // If we don't have enough data from the body, fetch from LISA
  if (!totalAmount || !guestEmail) {
    const res = await fetch(
      `${LISA_API}/public/reservations/${AGENT_ID}/by-id/${reservationId}`,
      { headers: { "x-agent-token": AGENT_TOKEN }, next: { revalidate: 0 } }
    );
    if (res.ok) {
      const data = await res.json();
      const r = data.reservation ?? data;
      totalAmount = r.totalAmount ?? totalAmount;
      guestEmail = r.guestEmail ?? guestEmail;
      guestName = r.guestName ?? guestName;
    }
  }

  if (!totalAmount) {
    return NextResponse.json({ error: "No se pudo obtener el monto de la reserva" }, { status: 400 });
  }

  const depositAmount = calculateDeposit(totalAmount);
  const amountInCents = depositAmount * 100;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://casa-hotel-la-mariela.aicstudio.tech";
  const redirectUrl = `${baseUrl}/reservar/confirmacion?id=${reservationId}`;

  const paymentUrl = generateWompiPaymentUrl({
    reference: reservationId,
    amountInCents,
    currency: "COP",
    redirectUrl,
    customerEmail: guestEmail,
    customerName: guestName,
  });

  return NextResponse.json({ paymentUrl, reference: reservationId, depositAmount, totalAmount, currency: "COP" });
}
