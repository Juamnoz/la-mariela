/**
 * Channel Manager integration stub.
 * When Channel Manager provides credentials, implement these methods.
 */

export interface ChannelBooking {
  channelRef: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  numPersons: number;
  totalAmount: number;
  source: "booking" | "airbnb" | "expedia";
}

// TODO: Set CHANNEL_MANAGER_API_URL and CHANNEL_MANAGER_API_KEY in .env
const CM_API_URL = process.env.CHANNEL_MANAGER_API_URL ?? "";
const CM_API_KEY = process.env.CHANNEL_MANAGER_API_KEY ?? "";

export async function updateChannelAvailability(
  _roomId: string,
  _checkIn: string,
  _checkOut: string,
  _available: boolean
): Promise<boolean> {
  // TODO: Update availability on channel manager
  // const response = await fetch(`${CM_API_URL}/availability`, {
  //   method: "PUT",
  //   headers: { Authorization: `Bearer ${CM_API_KEY}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ roomId: _roomId, checkIn: _checkIn, checkOut: _checkOut, available: _available }),
  // });
  // return response.ok;
  console.log("[ChannelManager stub] updateChannelAvailability", { _roomId, _checkIn, _checkOut, _available });
  return false;
}

export async function receiveChannelBooking(
  booking: ChannelBooking
): Promise<string | null> {
  // TODO: Process incoming booking from channel manager
  // This would typically be called from a webhook endpoint
  console.log("[ChannelManager stub] receiveChannelBooking", booking);
  return null;
}

export async function cancelOnChannels(channelRef: string): Promise<boolean> {
  // TODO: Cancel reservation across all channels
  console.log("[ChannelManager stub] cancelOnChannels", channelRef);
  return false;
}

export const channelManagerEnabled = Boolean(CM_API_KEY && CM_API_URL);
