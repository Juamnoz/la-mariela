import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// GET /api/reservas/[id]
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const reservation = await db.reservation.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  return NextResponse.json({
    reservation: {
      ...reservation,
      room: { ...reservation.room, images: JSON.parse(reservation.room.images) },
    },
  });
}

// PUT /api/reservas/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const existing = await db.reservation.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  const {
    checkIn,
    checkOut,
    numPersons,
    guestName,
    guestPhone,
    guestEmail,
    guestId,
    status,
    notes,
    source,
    depositPaid,
    wompiTxId,
  } = body;

  const updateData: Record<string, unknown> = {};
  if (checkIn) updateData.checkIn = new Date(checkIn);
  if (checkOut) updateData.checkOut = new Date(checkOut);
  if (numPersons !== undefined) updateData.numPersons = numPersons;
  if (guestName) updateData.guestName = guestName;
  if (guestPhone) updateData.guestPhone = guestPhone;
  if (guestEmail) updateData.guestEmail = guestEmail;
  if (guestId !== undefined) updateData.guestId = guestId;
  if (status) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;
  if (source) updateData.source = source;
  if (depositPaid !== undefined) updateData.depositPaid = depositPaid;
  if (wompiTxId !== undefined) updateData.wompiTxId = wompiTxId;

  const reservation = await db.reservation.update({
    where: { id },
    data: updateData,
    include: { room: true },
  });

  return NextResponse.json({
    reservation: {
      ...reservation,
      room: { ...reservation.room, images: JSON.parse(reservation.room.images) },
    },
  });
}

// DELETE /api/reservas/[id] — marks as cancelled
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const existing = await db.reservation.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  const reservation = await db.reservation.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ reservation });
}
