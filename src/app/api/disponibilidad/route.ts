import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { differenceInCalendarDays } from "date-fns";

// GET /api/disponibilidad?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&persons=N
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const persons = parseInt(searchParams.get("persons") ?? "1");

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      { error: "checkIn y checkOut son requeridos" },
      { status: 400 }
    );
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return NextResponse.json(
      { error: "checkOut debe ser posterior a checkIn" },
      { status: 400 }
    );
  }

  const nights = differenceInCalendarDays(checkOutDate, checkInDate);

  // High season: June–August, Nov 15–Jan 31, holiday bridges (Semana Santa not computed)
  function checkHighSeason(date: Date): boolean {
    const m = date.getMonth(); // 0-indexed
    const d = date.getDate();
    if (m >= 5 && m <= 7) return true; // June, July, August
    if (m === 10 && d >= 15) return true; // Nov 15+
    if (m === 11) return true; // December
    if (m === 0) return true; // January
    return false;
  }
  const isHighSeason = checkHighSeason(checkInDate);

  // Per-person pricing table (same across all room types)
  const lowSeasonRates: Record<number, number> = {
    1: 120000, 2: 150000, 3: 210000, 4: 260000, 5: 320000,
  };
  const highSeasonRates: Record<number, number> = {
    1: 160000, 2: 180000, 3: 220000, 4: 260000, 5: 320000,
  };
  const rates = isHighSeason ? highSeasonRates : lowSeasonRates;
  const capped = Math.min(Math.max(persons, 1), 5);
  const pricePerNight = rates[capped];

  // Get all rooms
  const rooms = await db.room.findMany({
    where: { maxPersons: { gte: persons } },
  });

  // Get conflicting reservations
  const conflicts = await db.reservation.findMany({
    where: {
      status: { not: "CANCELLED" },
      AND: [
        { checkIn: { lt: checkOutDate } },
        { checkOut: { gt: checkInDate } },
      ],
    },
    select: { roomId: true },
  });

  const bookedRoomIds = new Set(conflicts.map((c) => c.roomId));

  const availableRooms = rooms
    .filter((room) => !bookedRoomIds.has(room.id))
    .map((room) => {
      const totalPrice = nights * pricePerNight;
      return {
        ...room,
        images: JSON.parse(room.images),
        nights,
        pricePerNight,
        totalPrice,
        depositAmount: Math.ceil(totalPrice * 0.5),
        isHighSeason,
      };
    });

  return NextResponse.json({ availableRooms, nights, isHighSeason });
}
