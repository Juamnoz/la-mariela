"use server";

export async function testHosroomConnection(): Promise<{ ok: boolean; message: string }> {
  return { ok: false, message: "Hosroom no configurado — reservas gestionadas desde LISA PMS" };
}

export async function syncAllReservationsToHosroom(): Promise<{ ok: boolean; message: string; count?: number }> {
  return { ok: false, message: "Sincronización manejada desde LISA PMS" };
}

export async function testChannelManagerConnection(): Promise<{ ok: boolean; message: string }> {
  return { ok: false, message: "Channel Manager no configurado" };
}

export async function syncAvailabilityToChannels(): Promise<{ ok: boolean; message: string }> {
  return { ok: false, message: "Disponibilidad gestionada desde LISA" };
}
