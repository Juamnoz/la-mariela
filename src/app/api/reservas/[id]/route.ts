import { NextRequest, NextResponse } from "next/server";

const LISA_API = process.env.LISA_API_URL!;
const AGENT_ID = process.env.LISA_AGENT_ID!;
const AGENT_TOKEN = process.env.LISA_AGENT_TOKEN!;

const lisaHeaders = { "x-agent-token": AGENT_TOKEN, "Content-Type": "application/json" };

type Params = { params: Promise<{ id: string }> };

function normalize(r: Record<string, unknown>) {
  return {
    id: r.confirmationCode ?? r.id,
    roomId: r.roomTypeId,
    roomName: r.roomTypeName,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    numPersons: r.numPersons ?? r.adults,
    guestName: r.guestName,
    guestPhone: r.guestPhone,
    guestEmail: r.guestEmail,
    status: r.status,
    totalAmount: r.totalAmount,
    notes: r.notes,
    createdAt: r.createdAt,
  };
}

// GET /api/reservas/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const res = await fetch(
    `${LISA_API}/public/reservations/${AGENT_ID}/by-id/${id}`,
    { headers: lisaHeaders, next: { revalidate: 0 } }
  );
  if (!res.ok) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  const data = await res.json();
  return NextResponse.json({ reservation: normalize(data.reservation ?? data) });
}

// PUT /api/reservas/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const res = await fetch(
    `${LISA_API}/public/reservations/${AGENT_ID}/by-id/${id}`,
    {
      method: "PATCH",
      headers: lisaHeaders,
      body: JSON.stringify({ status: body.status, notes: body.notes }),
    }
  );
  if (!res.ok) return NextResponse.json({ error: "Error al actualizar" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json({ reservation: data.reservation ?? data });
}

// DELETE /api/reservas/[id] — cancel
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const res = await fetch(
    `${LISA_API}/public/reservations/${AGENT_ID}/by-id/${id}`,
    {
      method: "PATCH",
      headers: lisaHeaders,
      body: JSON.stringify({ status: "cancelled" }),
    }
  );
  if (!res.ok) return NextResponse.json({ error: "Error al cancelar" }, { status: res.status });
  return NextResponse.json({ ok: true });
}
