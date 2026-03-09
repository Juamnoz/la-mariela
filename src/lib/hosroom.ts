/**
 * Hosroom integration stub.
 * When Hosroom provides API credentials, implement these methods.
 */

export interface HosroomReservation {
  id?: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numPersons: number;
  totalAmount: number;
}

// TODO: Set HOSROOM_API_KEY and HOSROOM_PROPERTY_ID in .env
const HOSROOM_API_URL = process.env.HOSROOM_API_URL ?? "";
const HOSROOM_API_KEY = process.env.HOSROOM_API_KEY ?? "";

export async function syncReservationToHosroom(
  reservation: HosroomReservation
): Promise<string | null> {
  // TODO: Implement when Hosroom provides API
  // const response = await fetch(`${HOSROOM_API_URL}/reservations`, {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${HOSROOM_API_KEY}`, "Content-Type": "application/json" },
  //   body: JSON.stringify(reservation),
  // });
  // const data = await response.json();
  // return data.id;
  console.log("[Hosroom stub] syncReservationToHosroom", reservation);
  return null;
}

export async function getAvailabilityFromHosroom(
  _checkIn: string,
  _checkOut: string
): Promise<string[]> {
  // TODO: Return array of available room IDs from Hosroom
  // const response = await fetch(`${HOSROOM_API_URL}/availability?checkIn=${_checkIn}&checkOut=${_checkOut}`, {
  //   headers: { Authorization: `Bearer ${HOSROOM_API_KEY}` },
  // });
  // const data = await response.json();
  // return data.availableRooms.map((r: { id: string }) => r.id);
  console.log("[Hosroom stub] getAvailabilityFromHosroom", { _checkIn, _checkOut });
  return [];
}

export async function cancelInHosroom(hosroomId: string): Promise<boolean> {
  // TODO: Cancel reservation in Hosroom
  // const response = await fetch(`${HOSROOM_API_URL}/reservations/${hosroomId}/cancel`, {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${HOSROOM_API_KEY}` },
  // });
  // return response.ok;
  console.log("[Hosroom stub] cancelInHosroom", hosroomId);
  return false;
}

export const hosroomEnabled = Boolean(HOSROOM_API_KEY && HOSROOM_API_URL);
