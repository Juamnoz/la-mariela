import { Star } from "lucide-react";

const reviews = [
  {
    name: "Camila Torres",
    rating: 5,
    date: "Diciembre 2025",
    text: "Un lugar increíble en el Caribe colombiano. La habitación familiar muy cómoda, con todo lo necesario. Johana es una anfitriona excepcional. Volvemos el próximo año sin duda.",
    initials: "CT",
  },
  {
    name: "Santiago Pérez",
    rating: 5,
    date: "Noviembre 2025",
    text: "Sapzurro es mágico y La Mariela lo hace aún mejor. Aire acondicionado excelente, WiFi funciona muy bien para lo remoto del lugar. La atención personalizada es inigualable.",
    initials: "SP",
  },
  {
    name: "María José Restrepo",
    rating: 5,
    date: "Octubre 2025",
    text: "¡Lo mejor de Sapzurro! Habitaciones limpias, frescas y con todo el confort. El desayuno delicioso y la ubicación perfecta para explorar. 100% recomendado para familias.",
    initials: "MR",
  },
  {
    name: "Andrés Morales",
    rating: 4,
    date: "Agosto 2025",
    text: "Muy buena estadía. El lugar es precioso, las instalaciones cómodas y la atención muy amable. Sapzurro por sí solo ya vale el viaje, pero tener un hospedaje así lo hace perfecto.",
    initials: "AM",
  },
  {
    name: "Valentina Gómez",
    rating: 5,
    date: "Julio 2025",
    text: "Llegamos con 4 personas y la habitación cuádruple fue perfecta. Clima ideal gracias al A/C, Smart TV, baño privado impecable. Johana nos dio tips increíbles del pueblo.",
    initials: "VG",
  },
  {
    name: "Carlos Ruiz",
    rating: 5,
    date: "Enero 2025",
    text: "El mejor hospedaje de Sapzurro sin lugar a dudas. Reservamos por WhatsApp y en minutos ya teníamos todo confirmado. El trato familiar hace que te sientas en casa lejos de casa.",
    initials: "CR",
  },
];

const TOTAL = reviews.length;
const AVG = (reviews.reduce((s, r) => s + r.rating, 0) / TOTAL).toFixed(1);

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function Resenas() {
  return (
    <section id="resenas" className="py-20 bg-arena-light">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-turquesa text-sm font-semibold uppercase tracking-wider">
            Reseñas
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-selva-dark mt-2 mb-3">
            Lo que dicen nuestros huéspedes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experiencias reales de viajeros que eligieron Casa Hotel La Mariela
            para descubrir Sapzurro.
          </p>

          {/* Overall rating */}
          <div className="inline-flex items-center gap-4 mt-6 bg-white px-6 py-4 rounded-2xl shadow-sm border border-border">
            <div className="text-center">
              <p className="font-heading text-4xl font-bold text-selva-dark leading-none">
                {AVG}
              </p>
              <StarRow rating={5} size={18} />
              <p className="text-xs text-muted-foreground mt-1">
                {TOTAL} reseñas
              </p>
            </div>
            <div className="w-px h-12 bg-border" />
            {/* Google badge */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-semibold tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <span className="text-xs text-muted-foreground">Reseñas verificadas</span>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="bg-white rounded-2xl p-5 shadow-sm border border-border flex flex-col gap-3"
            >
              {/* Reviewer */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-selva text-white font-semibold text-sm flex items-center justify-center shrink-0">
                  {review.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-selva-dark text-sm truncate">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
                {/* Google G */}
                <div className="ml-auto shrink-0">
                  <span className="text-lg font-bold text-[#4285F4]">G</span>
                </div>
              </div>

              <StarRow rating={review.rating} />

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                "{review.text}"
              </p>
            </article>
          ))}
        </div>

        {/* CTA to Google */}
        <div className="text-center mt-8">
          <a
            href="https://maps.google.com/?q=Casa+Hotel+La+Mariela+Sapzurro+Chocó+Colombia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-selva hover:text-selva-dark transition-colors underline underline-offset-4"
          >
            Ver todas las reseñas en Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
