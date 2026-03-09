/**
 * Wompi payment integration.
 * Generates payment links for reservations.
 * Docs: https://docs.wompi.co
 */

const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY ?? "pub_test_XXXX";
const WOMPI_INTEGRITY_KEY = process.env.WOMPI_INTEGRITY_KEY ?? "";
const WOMPI_BASE_URL = "https://checkout.wompi.co/p/";

export interface WompiLinkParams {
  reference: string;   // unique reservation ID
  amountInCents: number;
  currency?: string;
  redirectUrl?: string;
  customerEmail?: string;
  customerName?: string;
}

/**
 * Generates the Wompi payment URL for a given reservation.
 * Returns the checkout URL to redirect the guest.
 */
export function generateWompiPaymentUrl(params: WompiLinkParams): string {
  const {
    reference,
    amountInCents,
    currency = "COP",
    redirectUrl,
    customerEmail,
    customerName,
  } = params;

  const url = new URL(WOMPI_BASE_URL);
  url.searchParams.set("public-key", WOMPI_PUBLIC_KEY);
  url.searchParams.set("currency", currency);
  url.searchParams.set("amount-in-cents", String(amountInCents));
  url.searchParams.set("reference", reference);

  if (redirectUrl) url.searchParams.set("redirect-url", redirectUrl);
  if (customerEmail) url.searchParams.set("customer-data:email", customerEmail);
  if (customerName) url.searchParams.set("customer-data:full-name", customerName);

  return url.toString();
}

/**
 * Calculates the deposit amount (50% of total).
 */
export function calculateDeposit(totalAmount: number): number {
  return Math.ceil(totalAmount * 0.5);
}

/**
 * Formats amount in Colombian pesos for display.
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Verifies Wompi webhook integrity signature.
 * To implement when setting up webhook endpoint.
 */
export async function verifyWompiSignature(
  _payload: string,
  _signature: string,
  _timestamp: string
): Promise<boolean> {
  if (!WOMPI_INTEGRITY_KEY) return false;
  // TODO: Implement HMAC-SHA256 verification
  // const text = `${_payload}${_timestamp}${WOMPI_INTEGRITY_KEY}`;
  // const hash = crypto.createHmac("sha256", WOMPI_INTEGRITY_KEY).update(text).digest("hex");
  // return hash === _signature;
  return false;
}
