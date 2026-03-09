import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// DB is at project root per .env DATABASE_URL="file:./dev.db"
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.room.deleteMany();

  await prisma.room.createMany({
    data: [
      {
        id: "HAB-FAM-01",
        name: "Habitación Familiar",
        type: "FAMILIAR",
        maxPersons: 5,
        priceBase: 120000,
        priceHigh: 160000,
        description: "Amplia habitación para familias de hasta 5 personas en el corazón de Sapzurro. Equipada con baño privado, aire acondicionado, WiFi, Smart TV y 2 ventiladores. El espacio perfecto para explorar el Caribe colombiano juntos.",
        images: JSON.stringify(["/images/hab-familiar-1.jpeg", "/images/hab-familiar-2.jpeg", "/images/hab-familiar-3.jpeg", "/images/hab-familiar-4.jpeg", "/images/hab-familiar-5.jpeg"]),
      },
      {
        id: "HAB-TRI-01",
        name: "Habitación Triple",
        type: "TRIPLE",
        maxPersons: 3,
        priceBase: 120000,
        priceHigh: 160000,
        description: "Habitación acogedora para hasta 3 personas, ideal para parejas o grupos de amigos. Baño privado, aire acondicionado, WiFi, Smart TV y 2 ventiladores. La opción más versátil de Casa Hotel La Mariela.",
        images: JSON.stringify(["/images/hab-triple-2.jpeg", "/images/hab-triple-3.jpeg", "/images/hab-triple-4.jpeg", "/images/hab-triple-5.jpeg"]),
      },
      {
        id: "HAB-CUA-01",
        name: "Habitación Cuádruple",
        type: "CUADRUPLE",
        maxPersons: 4,
        priceBase: 120000,
        priceHigh: 160000,
        description: "Espaciosa habitación para grupos de 4 personas con el encanto del Caribe chocoano. Baño privado, aire acondicionado, WiFi, Smart TV y 2 ventiladores. Confort tropical a pasos del mar.",
        images: JSON.stringify(["/images/hab-cuadruple-2.jpeg", "/images/hab-cuadruple-3.jpeg"]),
      },
    ],
  });

  console.log("✅ Seed completado — 3 habitaciones creadas");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
