"use server";
import db from "@/lib/db";
import { hosroomEnabled, syncReservationToHosroom, getAvailabilityFromHosroom, cancelInHosroom } from "@/lib/hosroom";
import { channelManagerEnabled, updateChannelAvailability, cancelOnChannels } from "@/lib/channel-manager";

// ── Hosroom actions ───────────────────────────────────────────────────────────

export async function testHosroomConnection(): Promise<{ ok: boolean; message: string }> {
  if (!hosroomEnabled) {
    return { ok: false, message: "No configurado: agrega HOSROOM_API_URL y HOSROOM_API_KEY en .env.local" };
  }
  try {
    await getAvailabilityFromHosroom(new Date().toISOString().split("T")[0], new Date().toISOString().split("T")[0]);
    return { ok: true, message: "Conexión exitosa con Hosroom PMS" };
  } catch (e) {
    return { ok: false, message: `Error: ${e instanceof Error ? e.message : "Error desconocido"}` };
  }
}

export async function syncAllReservationsToHosroom(): Promise<{ ok: boolean; message: string; count?: number }> {
  if (!hosroomEnabled) {
    return { ok: false, message: "No configurado: agrega HOSROOM_API_URL y HOSROOM_API_KEY en .env.local" };
  }
  try {
    const reservations = await db.reservation.findMany({
      where: { status: { not: "CANCELLED" }, hosroomId: null },
      include: { room: true },
    });
    let synced = 0;
    for (const r of reservations) {
      const hosroomId = await syncReservationToHosroom({
        roomId: r.roomId,
        checkIn: r.checkIn.toISOString().split("T")[0],
        checkOut: r.checkOut.toISOString().split("T")[0],
        guestName: r.guestName,
        guestEmail: r.guestEmail,
        guestPhone: r.guestPhone,
        numPersons: r.numPersons,
        totalAmount: r.totalAmount,
      });
      if (hosroomId) {
        await db.reservation.update({ where: { id: r.id }, data: { hosroomId } });
        synced++;
      }
    }
    return { ok: true, message: `${synced} reservas sincronizadas con Hosroom`, count: synced };
  } catch (e) {
    return { ok: false, message: `Error: ${e instanceof Error ? e.message : "Error desconocido"}` };
  }
}

// ── Channel Manager actions ───────────────────────────────────────────────────

export async function testChannelManagerConnection(): Promise<{ ok: boolean; message: string }> {
  if (!channelManagerEnabled) {
    return { ok: false, message: "No configurado: agrega CHANNEL_MANAGER_API_URL y CHANNEL_MANAGER_API_KEY en .env.local" };
  }
  try {
    await updateChannelAvailability("HAB-TRI-01", new Date().toISOString().split("T")[0], new Date().toISOString().split("T")[0], true);
    return { ok: true, message: "Conexión exitosa con Channel Manager" };
  } catch (e) {
    return { ok: false, message: `Error: ${e instanceof Error ? e.message : "Error desconocido"}` };
  }
}

export async function syncAvailabilityToChannels(): Promise<{ ok: boolean; message: string }> {
  if (!channelManagerEnabled) {
    return { ok: false, message: "No configurado: agrega CHANNEL_MANAGER_API_URL y CHANNEL_MANAGER_API_KEY en .env.local" };
  }
  try {
    const rooms = await db.room.findMany();
    const today = new Date().toISOString().split("T")[0];
    const in90 = new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0];
    let synced = 0;
    for (const room of rooms) {
      const ok = await updateChannelAvailability(room.id, today, in90, true);
      if (ok) synced++;
    }
    return { ok: true, message: `Disponibilidad de ${synced} habitaciones enviada a los canales` };
  } catch (e) {
    return { ok: false, message: `Error: ${e instanceof Error ? e.message : "Error desconocido"}` };
  }
}
