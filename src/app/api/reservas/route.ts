import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { CreateReservationInput } from "@/lib/types";
import { differenceInCalendarDays, format } from "date-fns";

// GET /api/reservas — list all reservations (admin)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (dateFrom || dateTo) {
    where.checkIn = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
  }

  const reservations = await db.reservation.findMany({
    where,
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });

  const parsed = reservations.map((r) => ({
    ...r,
    room: r.room
      ? { ...r.room, images: JSON.parse(r.room.images) }
      : undefined,
  }));

  return NextResponse.json({ reservations: parsed });
}

// POST /api/reservas — create a new reservation
export async function POST(request: NextRequest) {
  const body: CreateReservationInput = await request.json();

  const {
    roomId,
    checkIn,
    checkOut,
    numPersons,
    guestName,
    guestPhone,
    guestEmail,
    guestId,
    notes,
    source = "directo",
  } = body;

  // Validate required fields
  if (!roomId || !checkIn || !checkOut || !numPersons || !guestName || !guestPhone || !guestEmail) {
    return NextResponse.json(
      { error: "Faltan campos requeridos" },
      { status: 400 }
    );
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return NextResponse.json(
      { error: "La fecha de salida debe ser posterior a la de llegada" },
      { status: 400 }
    );
  }

  // Check room exists
  const room = await db.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return NextResponse.json({ error: "Habitación no encontrada" }, { status: 404 });
  }

  // Check availability
  const conflict = await db.reservation.findFirst({
    where: {
      roomId,
      status: { not: "CANCELLED" },
      AND: [
        { checkIn: { lt: checkOutDate } },
        { checkOut: { gt: checkInDate } },
      ],
    },
  });

  if (conflict) {
    return NextResponse.json(
      { error: "La habitación no está disponible para esas fechas" },
      { status: 409 }
    );
  }

  // Calculate price
  const nights = differenceInCalendarDays(checkOutDate, checkInDate);
  const isHighSeason = checkInDate.getMonth() >= 5 && checkInDate.getMonth() <= 8; // Jun-Sep
  const pricePerNight = isHighSeason ? room.priceHigh : room.priceBase;
  const totalAmount = nights * pricePerNight;

  // Generate ID
  const year = checkInDate.getFullYear();
  const count = await db.reservation.count();
  const id = `RES-${year}-${String(count + 1).padStart(4, "0")}`;

  const reservation = await db.reservation.create({
    data: {
      id,
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numPersons,
      guestName,
      guestPhone,
      guestEmail,
      guestId,
      notes,
      source,
      totalAmount,
      status: "PENDING",
    },
    include: { room: true },
  });

  return NextResponse.json(
    {
      reservation: {
        ...reservation,
        room: { ...reservation.room, images: JSON.parse(reservation.room.images) },
      },
    },
    { status: 201 }
  );
}
