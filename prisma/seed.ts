import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// DB is at project root per .env DATABASE_URL="file:./dev.db"
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.room.deleteMany();

  // Tarifas por personas (todas las habitaciones comparten la misma tabla de precios):
  // Temp. baja:  1P $120k · 2P $150k · 3P $210k · 4P $260k · 5P $320k
  // Temp. alta:  1P $160k · 2P $180k · 3P $220k · 4P $260k · 5P $320k
  // priceBase = tarifa mínima (1P baja); priceHigh = tarifa máxima del cuarto (alta)
  await prisma.room.createMany({
    data: [
      {
        id: "HAB-TRI-01",
        name: "Habitación Triple",
        type: "TRIPLE",
        maxPersons: 3,
        priceBase: 120000,  // 1P temporada baja
        priceHigh: 220000,  // 3P temporada alta
        description: "Habitación acogedora para hasta 3 personas, ideal para parejas o grupos de amigos. Baño privado, aire acondicionado, WiFi, Smart TV y 2 ventiladores. 1P $120k · 2P $150k · 3P $210k (temporada baja).",
        images: JSON.stringify(["/images/hab-triple-2.jpeg", "/images/hab-triple-3.jpeg", "/images/hab-triple-4.jpeg", "/images/hab-triple-5.jpeg"]),
      },
      {
        id: "HAB-CUA-01",
        name: "Habitación Cuádruple",
        type: "CUADRUPLE",
        maxPersons: 4,
        priceBase: 120000,  // 1P temporada baja
        priceHigh: 260000,  // 4P temporada alta
        description: "Espaciosa habitación para grupos de hasta 4 personas con el encanto del Caribe chocoano. Baño privado, aire acondicionado, WiFi, Smart TV y 2 ventiladores. 3P $210k · 4P $260k (temporada baja).",
        images: JSON.stringify(["/images/hab-cuadruple-2.jpeg", "/images/hab-cuadruple-3.jpeg"]),
      },
      {
        id: "HAB-FAM-01",
        name: "Habitación Familiar",
        type: "FAMILIAR",
        maxPersons: 5,
        priceBase: 120000,  // 1P temporada baja
        priceHigh: 320000,  // 5P temporada alta
        description: "La más amplia de la casa, ideal para familias de hasta 5 personas en el corazón de Sapzurro. Baño privado, aire acondicionado, WiFi, Smart TV y 2 ventiladores. 3P $210k · 4P $260k · 5P $320k (temporada baja).",
        images: JSON.stringify(["/images/hab-familiar-1.jpeg", "/images/hab-familiar-2.jpeg", "/images/hab-familiar-3.jpeg", "/images/hab-familiar-4.jpeg", "/images/hab-familiar-5.jpeg"]),
      },
    ],
  });

  console.log("✅ Seed completado — 3 habitaciones creadas");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
