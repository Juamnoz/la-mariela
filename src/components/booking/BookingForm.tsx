"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format, differenceInCalendarDays } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Calendar,
  Users,
  Home,
  User,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";

type DateRange = { from: Date | undefined; to: Date | undefined };

type AvailableRoom = {
  id: string;
  name: string;
  type: string;
  maxPersons: number;
  priceBase: number;
  priceHigh: number;
  description: string;
  images: string[];
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  depositAmount: number;
  isHighSeason: boolean;
};

const STEPS = [
  { label: "Fechas", icon: Calendar },
  { label: "Habitación", icon: Home },
  { label: "Datos", icon: User },
  { label: "Pago", icon: CreditCard },
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    function check() { setIsDesktop(window.innerWidth >= 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

// Convert string "YYYY-MM-DD" to Date at noon to avoid timezone drift
function parseDate(str: string): Date {
  return new Date(str + "T12:00:00");
}
function formatDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

// Step slide variants
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};
const spring = { type: "spring" as const, stiffness: 300, damping: 30 };
const appleEase = [0.22, 1, 0.36, 1] as const;

// ── Progress Indicator ────────────────────────────────────────────────────────
function ProgressPills({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        const Icon = s.icon;
        return (
          <div key={n} className="flex items-center gap-2">
            <motion.div
              layout
              transition={{ duration: 0.4, ease: appleEase }}
              className={`flex items-center gap-1.5 overflow-hidden transition-colors rounded-full ${
                active
                  ? "bg-turquesa text-white px-4 py-2 shadow-md"
                  : done
                  ? "bg-selva text-white w-8 h-8 justify-center"
                  : "bg-muted text-muted-foreground w-8 h-8 justify-center"
              }`}
            >
              {done ? (
                <Check size={14} />
              ) : (
                <>
                  <Icon size={14} />
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-xs font-semibold whitespace-nowrap"
                    >
                      {s.label}
                    </motion.span>
                  )}
                </>
              )}
            </motion.div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 transition-colors duration-300 ${done ? "bg-selva" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Persons Stepper ───────────────────────────────────────────────────────────
function PersonsStepper({ value, onChange, min = 1, max = 5 }: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 rounded-full border-2 border-border flex items-center justify-center text-selva hover:border-selva disabled:opacity-30 transition-colors"
      >
        <Minus size={14} />
      </motion.button>

      <div className="w-12 text-center overflow-hidden relative h-8 flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.18, ease: appleEase }}
            className="font-bold text-xl text-selva-dark absolute"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 rounded-full border-2 border-border flex items-center justify-center text-selva hover:border-selva disabled:opacity-30 transition-colors"
      >
        <Plus size={14} />
      </motion.button>

      <span className="text-sm text-muted-foreground">
        {value === 1 ? "persona" : "personas"}
      </span>
    </div>
  );
}

// ── Floating Label Input ──────────────────────────────────────────────────────
function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  required,
  placeholder,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder ?? " "}
        required={required}
        className={`peer w-full border rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 bg-white placeholder-transparent transition-colors ${
          error
            ? "border-red-400 focus:ring-red-300/40"
            : "border-border focus:ring-turquesa/40"
        }`}
      />
      <label
        className={`absolute left-4 top-3.5 text-xs text-muted-foreground transition-all pointer-events-none
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
          peer-focus:top-1.5 peer-focus:text-[10px]
          peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]
          ${error ? "peer-focus:text-red-500" : "peer-focus:text-turquesa"}`}
      >
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BookingForm() {
  const searchParams = useSearchParams();
  const isDesktop = useIsDesktop();

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const initCheckIn = searchParams.get("checkIn") || todayStr;
  const initCheckOut = searchParams.get("checkOut") || tomorrowStr;
  const [range, setRange] = useState<DateRange>({
    from: parseDate(initCheckIn),
    to: parseDate(initCheckOut),
  });
  const [persons, setPersons] = useState(Number(searchParams.get("persons") || 2));

  // Step 2
  const [rooms, setRooms] = useState<AvailableRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null);

  // Step 3
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestId, setGuestId] = useState("");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean }>({});

  // Step 4
  const [reservation, setReservation] = useState<{ id: string; totalAmount: number } | null>(null);
  const [paymentUrl, setPaymentUrl] = useState("");

  const preselected = searchParams.get("room");

  const checkIn = range.from ? formatDate(range.from) : todayStr;
  const checkOut = range.to ? formatDate(range.to) : tomorrowStr;
  const nights = range.from && range.to
    ? differenceInCalendarDays(range.to, range.from)
    : 0;

  function goTo(n: number) {
    setDir(n > step ? 1 : -1);
    setStep(n);
  }

  async function loadAvailability() {
    if (nights <= 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/disponibilidad?checkIn=${checkIn}&checkOut=${checkOut}&persons=${persons}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRooms(data.availableRooms);
      if (preselected) {
        const found = data.availableRooms.find((r: AvailableRoom) => r.id === preselected);
        if (found) setSelectedRoom(found);
      }
      goTo(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando disponibilidad");
    } finally {
      setLoading(false);
    }
  }

  function validateField(field: "name" | "email" | "phone", val: string) {
    if (field === "name") return val.trim() ? undefined : "El nombre es obligatorio";
    if (field === "email") {
      if (!val.trim()) return "El email es obligatorio";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Ingresa un email válido";
    }
    if (field === "phone") {
      if (!val.trim()) return "El teléfono es obligatorio";
      if (val.replace(/\D/g, "").length < 7) return "Ingresa un teléfono válido";
    }
    return undefined;
  }

  function handleBlur(field: "name" | "email" | "phone", val: string) {
    setTouched((t) => ({ ...t, [field]: true }));
    const err = validateField(field, val);
    setFieldErrors((e) => ({ ...e, [field]: err }));
  }

  function validateAndSubmit() {
    const nameErr = validateField("name", guestName);
    const emailErr = validateField("email", guestEmail);
    const phoneErr = validateField("phone", guestPhone);
    setFieldErrors({ name: nameErr, email: emailErr, phone: phoneErr });
    setTouched({ name: true, email: true, phone: true });
    if (!nameErr && !emailErr && !phoneErr) createReservation();
  }

  async function createReservation() {
    if (!selectedRoom) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          checkIn,
          checkOut,
          numPersons: persons,
          guestName,
          guestEmail,
          guestPhone,
          guestId: guestId || undefined,
          notes: notes || undefined,
          source: "directo",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReservation(data.reservation);

      const payRes = await fetch("/api/pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: data.reservation.id }),
      });
      const payData = await payRes.json();
      if (payRes.ok) setPaymentUrl(payData.paymentUrl);

      goTo(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error creando la reserva");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <ProgressPills step={step} />

      {error && (
        <div className="mb-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait" custom={dir}>
        {/* ── STEP 1: Dates ─────────────────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-6"
          >
            <h2 className="font-heading text-xl font-semibold text-selva-dark flex items-center gap-2">
              <Calendar size={20} className="text-turquesa" />
              Seleccione sus fechas
            </h2>

            {/* Calendar */}
            <div className="rdp-wrapper bg-arena-light/50 rounded-2xl p-4">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={(r) => setRange({ from: r?.from, to: r?.to })}
                locale={es}
                numberOfMonths={isDesktop ? 2 : 1}
                disabled={{ before: new Date() }}
                classNames={{
                  months: "relative flex flex-row gap-8 justify-center",
                  month_caption: "font-heading font-semibold text-selva-dark capitalize pb-1",
                  nav: "absolute top-0 right-0 flex gap-1 z-10",
                  today: "rdp-today",
                  range_start: "rdp-range_start",
                  range_end: "rdp-range_end",
                  range_middle: "rdp-range_middle",
                  selected: "rdp-selected",
                  disabled: "opacity-25 cursor-not-allowed",
                  outside: "opacity-30",
                }}
                components={{
                  PreviousMonthButton: (props) => (
                    <button
                      {...props}
                      className="text-selva hover:bg-selva/10 rounded-lg p-1.5 transition-colors disabled:opacity-30"
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  ),
                  NextMonthButton: (props) => (
                    <button
                      {...props}
                      className="text-selva hover:bg-selva/10 rounded-lg p-1.5 transition-colors disabled:opacity-30"
                      aria-label="Mes siguiente"
                    >
                      <ChevronRight size={18} />
                    </button>
                  ),
                }}
              />
            </div>

            {/* Night summary pill */}
            <AnimatePresence>
              {nights > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: appleEase }}
                  className="flex items-center gap-2 bg-arena-light rounded-xl px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-selva">
                    {nights} {nights === 1 ? "noche" : "noches"}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {range.from && format(range.from, "d MMM", { locale: es })}
                    {" → "}
                    {range.to && format(range.to, "d MMM yyyy", { locale: es })}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Persons stepper */}
            <div>
              <label className="text-xs font-semibold text-selva uppercase tracking-wide flex items-center gap-1 mb-3">
                <Users size={12} />
                Número de personas
              </label>
              <PersonsStepper value={persons} onChange={setPersons} />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={loadAvailability}
              disabled={loading || nights <= 0}
              className="w-full flex items-center justify-center gap-2 bg-selva hover:bg-selva-dark text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
              Ver habitaciones disponibles
            </motion.button>
          </motion.div>
        )}

        {/* ── STEP 2: Rooms ─────────────────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <h2 className="font-heading text-xl font-semibold text-selva-dark flex items-center gap-2 mb-1">
                <Home size={20} className="text-turquesa" />
                Habitaciones disponibles
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                {nights} noche{nights !== 1 ? "s" : ""} ·{" "}
                {range.from && format(range.from, "d MMM", { locale: es })} →{" "}
                {range.to && format(range.to, "d MMM", { locale: es })} · {persons} persona{persons !== 1 ? "s" : ""}
              </p>

              {rooms.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Home size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No hay habitaciones disponibles para esas fechas.</p>
                  <p className="text-xs mt-1">Pruebe otras fechas o contáctenos por WhatsApp.</p>
                </div>
              ) : (
                <motion.div
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                >
                  {rooms.map((room) => (
                    <motion.button
                      key={room.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 28 } },
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedRoom(room)}
                      className={`w-full text-left rounded-xl border-2 transition-colors overflow-hidden ${
                        selectedRoom?.id === room.id
                          ? "border-selva bg-selva/5"
                          : "border-border hover:border-turquesa/50"
                      }`}
                    >
                      <div className="flex">
                        {room.images[0] && (
                          <div className="relative w-28 sm:w-36 shrink-0 self-stretch min-h-[110px]">
                            <Image
                              src={room.images[0]}
                              alt={room.name}
                              fill
                              className="object-cover"
                              sizes="144px"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-4 flex justify-between items-start gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-selva-dark">{room.name}</p>
                              <AnimatePresence>
                                {selectedRoom?.id === room.id && (
                                  <motion.div
                                    layoutId="room-check"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="w-5 h-5 bg-selva rounded-full flex items-center justify-center"
                                  >
                                    <Check size={11} className="text-white" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Máx. {room.maxPersons} personas ·{" "}
                              {room.isHighSeason ? "Temporada alta" : "Temporada baja"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                              {room.description}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-selva">
                              ${room.totalPrice.toLocaleString("es-CO")}
                            </p>
                            <p className="text-xs text-muted-foreground">total</p>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => goTo(1)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                <ChevronLeft size={16} />
                Atrás
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => selectedRoom && goTo(3)}
                disabled={!selectedRoom}
                className="flex-1 flex items-center justify-center gap-2 bg-selva hover:bg-selva-dark text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Guest data ────────────────────────────────────────── */}
        {step === 3 && (
          <motion.div
            key="step3"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-5">
              <h2 className="font-heading text-xl font-semibold text-selva-dark flex items-center gap-2">
                <User size={20} className="text-turquesa" />
                Datos del huésped
              </h2>

              {selectedRoom && (
                <div className="rounded-xl p-4 text-sm bg-gradient-to-r from-selva to-turquesa text-white">
                  <p className="font-semibold">{selectedRoom.name}</p>
                  <p className="text-white/80 text-xs mt-0.5">
                    {range.from && format(range.from, "d MMM", { locale: es })} →{" "}
                    {range.to && format(range.to, "d MMM yyyy", { locale: es })} · {nights} noches
                  </p>
                  <p className="text-white font-bold mt-1">
                    ${selectedRoom.totalPrice.toLocaleString("es-CO")} COP
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground -mt-1">
                Los campos marcados con <span className="text-red-400 font-semibold">*</span> son obligatorios.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label="Nombre completo" value={guestName} required
                  onChange={(v) => { setGuestName(v); if (touched.name) setFieldErrors((e) => ({ ...e, name: validateField("name", v) })); }}
                  onBlur={() => handleBlur("name", guestName)}
                  error={fieldErrors.name}
                />
                <FloatingInput label="Cédula / Documento" value={guestId} onChange={setGuestId} />
                <FloatingInput
                  label="Email" type="email" value={guestEmail} required
                  onChange={(v) => { setGuestEmail(v); if (touched.email) setFieldErrors((e) => ({ ...e, email: validateField("email", v) })); }}
                  onBlur={() => handleBlur("email", guestEmail)}
                  error={fieldErrors.email}
                />
                <FloatingInput
                  label="Teléfono / WhatsApp" type="tel" value={guestPhone} required placeholder="+57 300 0000000"
                  onChange={(v) => { setGuestPhone(v); if (touched.phone) setFieldErrors((e) => ({ ...e, phone: validateField("phone", v) })); }}
                  onBlur={() => handleBlur("phone", guestPhone)}
                  error={fieldErrors.phone}
                />
              </div>

              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder=" "
                  rows={3}
                  className="peer w-full border border-border rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-turquesa/40 resize-none bg-white placeholder-transparent"
                />
                <label className="absolute left-4 top-3.5 text-xs text-muted-foreground pointer-events-none transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-turquesa peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]">
                  Notas adicionales
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => goTo(2)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                <ChevronLeft size={16} />
                Atrás
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={validateAndSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-selva hover:bg-selva-dark text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
                Confirmar y pagar
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: Payment ───────────────────────────────────────────── */}
        {step === 4 && reservation && selectedRoom && (
          <motion.div
            key="step4"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-6"
          >
            {/* Animated checkmark */}
            <div className="text-center">
              <div className="w-16 h-16 bg-selva/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 52 52" className="w-10 h-10">
                  <circle cx="26" cy="26" r="24" fill="none" stroke="oklch(0.42 0.12 148)" strokeWidth="2.5" />
                  <motion.path
                    d="M14 27 L22 35 L38 17"
                    fill="none"
                    stroke="oklch(0.42 0.12 148)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.4, ease: appleEase }}
                  />
                </svg>
              </div>
              <h2 className="font-heading text-xl font-semibold text-selva-dark">
                ¡Reserva creada!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Código: <span className="font-mono font-semibold text-selva">{reservation.id}</span>
              </p>
            </div>

            {/* Summary */}
            <div className="bg-arena-light rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Habitación</span>
                <span className="font-medium">{selectedRoom.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fechas</span>
                <span className="font-medium">
                  {range.from && format(range.from, "d MMM", { locale: es })} →{" "}
                  {range.to && format(range.to, "d MMM yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Personas</span>
                <span className="font-medium">{persons}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-selva-dark">${reservation.totalAmount.toLocaleString("es-CO")} COP</span>
              </div>
            </div>

            {/* Payment CTAs */}
            <div className="space-y-3">
              {/* PRIMARY: full payment */}
              <motion.a
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                href={paymentUrl || `https://wa.me/573006168064?text=Hola%2C%20acabo%20de%20reservar%20(${reservation.id})%20y%20quiero%20pagar%20el%20total`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex flex-col items-center justify-center gap-0.5 bg-selva hover:bg-selva-dark text-white font-semibold py-4 rounded-xl transition-colors text-center"
              >
                <span className="flex items-center gap-2 text-base">
                  <CreditCard size={18} />
                  Pagar ahora — ${reservation.totalAmount.toLocaleString("es-CO")} COP
                </span>
                <span className="text-white/70 text-xs font-normal">Pago completo · Confirmación inmediata</span>
              </motion.a>

              {/* SECONDARY: 50% offer */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: appleEase }}
                className="border-2 border-turquesa/40 bg-turquesa/5 rounded-xl p-4 space-y-3 relative overflow-hidden"
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-turquesa/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                />
                <div className="relative flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-turquesa">Oferta especial</span>
                </div>
                <p className="relative text-sm text-selva-dark leading-relaxed">
                  Asegura tu lugar hoy con solo el <strong>50%</strong>. El resto lo pagas cómodamente al llegar.
                </p>
                <motion.a
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  href={paymentUrl || `https://wa.me/573006168064?text=Hola%2C%20quiero%20pagar%20el%2050%25%20de%20abono%20(${reservation.id})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full flex items-center justify-center gap-2 bg-turquesa hover:bg-selva text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Pagar 50% → ${Math.ceil(reservation.totalAmount * 0.5).toLocaleString("es-CO")} COP
                  <ChevronRight size={16} />
                </motion.a>
              </motion.div>

              <p className="text-xs text-center text-muted-foreground">
                Ambas opciones están seguras con Wompi · Transacción cifrada
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
