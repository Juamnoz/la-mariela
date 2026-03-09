import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { generateWompiPaymentUrl, calculateDeposit } from "@/lib/wompi";

// POST /api/pago — generate Wompi payment link for a reservation
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { reservationId } = body;

  if (!reservationId) {
    return NextResponse.json({ error: "reservationId es requerido" }, { status: 400 });
  }

  const reservation = await db.reservation.findUnique({
    where: { id: reservationId },
    include: { room: true },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  if (reservation.status === "CANCELLED") {
    return NextResponse.json({ error: "La reserva está cancelada" }, { status: 400 });
  }

  const depositAmount = calculateDeposit(reservation.totalAmount);
  const amountInCents = depositAmount * 100; // Wompi uses centavos

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const redirectUrl = `${baseUrl}/reservar/confirmacion?id=${reservationId}`;

  const paymentUrl = generateWompiPaymentUrl({
    reference: reservationId,
    amountInCents,
    currency: "COP",
    redirectUrl,
    customerEmail: reservation.guestEmail,
    customerName: reservation.guestName,
  });

  return NextResponse.json({
    paymentUrl,
    reference: reservationId,
    depositAmount,
    totalAmount: reservation.totalAmount,
    currency: "COP",
  });
}
