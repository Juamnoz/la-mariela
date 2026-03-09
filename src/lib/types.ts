export type RoomType = "FAMILIAR" | "TRIPLE" | "CUADRUPLE";
export type ReservStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type ReservSource = "directo" | "booking" | "airbnb" | "whatsapp";

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  maxPersons: number;
  priceBase: number;
  priceHigh: number;
  description: string;
  images: string[]; // parsed from JSON string
}

export interface Reservation {
  id: string;
  roomId: string;
  room?: Room;
  checkIn: Date | string;
  checkOut: Date | string;
  numPersons: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestId?: string;
  status: ReservStatus;
  totalAmount: number;
  depositPaid: number;
  wompiTxId?: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  hosroomId?: string;
  channelRef?: string;
  source?: ReservSource;
}

export interface BookingSearchParams {
  checkIn: string;
  checkOut: string;
  numPersons: number;
}

export interface AvailableRoom extends Room {
  nights: number;
  totalPrice: number;
  depositAmount: number;
  isHighSeason: boolean;
}

export interface WompiPaymentLink {
  url: string;
  reference: string;
  amount: number;
}

export interface CreateReservationInput {
  roomId: string;
  checkIn: string;
  checkOut: string;
  numPersons: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestId?: string;
  notes?: string;
  source?: ReservSource;
}

export interface AdminStats {
  todayCheckIns: number;
  todayCheckOuts: number;
  pendingReservations: number;
  confirmedReservations: number;
  occupancyRate: number;
  monthRevenue: number;
}
