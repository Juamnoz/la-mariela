import { NextRequest, NextResponse } from "next/server";

const LISA_API = process.env.LISA_API_URL!;
const AGENT_ID = process.env.LISA_AGENT_ID!;
const AGENT_TOKEN = process.env.LISA_AGENT_TOKEN!;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const persons = searchParams.get("persons") ?? "1";

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "checkIn y checkOut son requeridos" }, { status: 400 });
  }

  const params = new URLSearchParams({ checkIn, checkOut, persons });
  const res = await fetch(
    `${LISA_API}/public/reservations/${AGENT_ID}/disponibilidad?${params}`,
    { headers: { "x-agent-token": AGENT_TOKEN }, next: { revalidate: 0 } }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error de disponibilidad" }));
    return NextResponse.json({ error: err.message }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
