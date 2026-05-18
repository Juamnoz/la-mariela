import { NextRequest, NextResponse } from "next/server";

const LISA_API = process.env.LISA_API_URL!;
const AGENT_ID = process.env.LISA_AGENT_ID!;
const AGENT_TOKEN = process.env.LISA_AGENT_TOKEN!;

const lisaHeaders = { "x-agent-token": AGENT_TOKEN, "Content-Type": "application/json" };

// GET /api/reservas — list reservations (admin panel)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const res = await fetch(
    `${LISA_API}/public/reservations/${AGENT_ID}/list?${params}`,
    { headers: lisaHeaders, next: { revalidate: 0 } }
  );

  if (!res.ok) return NextResponse.json({ reservations: [] });
  const data = await res.json();
  return NextResponse.json(data);
}

// POST /api/reservas — create reservation via LISA public API
export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    roomId, checkIn, checkOut, numPersons,
    guestName, guestPhone, guestEmail, guestId, notes, totalAmount,
  } = body;

  if (!roomId || !checkIn || !checkOut || !numPersons || !guestName || !guestPhone || !guestEmail) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const res = await fetch(`${LISA_API}/public/reservations/${AGENT_ID}`, {
    method: "POST",
    headers: lisaHeaders,
    body: JSON.stringify({
      roomTypeId: roomId,
      checkIn,
      checkOut,
      adults: numPersons,
      guestName,
      guestPhone,
      guestEmail,
      guestId,
      notes,
      totalPrice: totalAmount,
      source: "motor_web",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data.message ?? "Error al crear la reserva" }, { status: res.status });
  }

  const r = data.reservation ?? data;
  return NextResponse.json(
    {
      reservation: {
        id: r.confirmationCode ?? r.id,
        roomId: r.roomTypeId,
        checkIn: r.checkInDate ?? r.checkIn,
        checkOut: r.checkOutDate ?? r.checkOut,
        numPersons: r.adults ?? numPersons,
        guestName: r.guestName,
        guestPhone: r.guestPhone,
        guestEmail: r.guestEmail,
        status: r.status ?? "pending",
        totalAmount: r.totalPrice ?? totalAmount,
        depositPaid: 0,
        createdAt: r.createdAt ?? new Date().toISOString(),
      },
    },
    { status: 201 }
  );
}
