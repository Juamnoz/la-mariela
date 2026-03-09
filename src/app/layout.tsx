import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Casa Hotel La Mariela — Sapzurro, Chocó",
  description:
    "Hospedaje familiar en Sapzurro, el paraíso más austral del Caribe colombiano. Habitaciones cómodas, trato personalizado y naturaleza desbordante en el corazón del Urabá chocoano.",
  keywords:
    "hotel sapzurro, hospedaje sapzurro, casa hotel la mariela, chocó, caribe colombiano, urabá, capurganá, acandí",
  openGraph: {
    title: "Casa Hotel La Mariela — Sapzurro, Chocó",
    description:
      "Hospedaje familiar en Sapzurro, el paraíso más austral del Caribe colombiano.",
    images: ["/images/fachada.jpeg"],
    type: "website",
  },
};

const hotelSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Casa Hotel La Mariela",
  "description": "Hospedaje familiar en Sapzurro, el paraíso más austral del Caribe colombiano. Habitaciones con baño privado, aire acondicionado, WiFi y Smart TV.",
  "url": "https://lamarielasapzurro.com",
  "telephone": "+573006168064",
  "email": "hotellamariela@gmail.com",
  "image": "https://lamarielasapzurro.com/images/fachada.jpeg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sapzurro",
    "addressLocality": "Sapzurro",
    "addressRegion": "Chocó",
    "addressCountry": "CO",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 8.6643,
    "longitude": -77.3538,
  },
  "checkinTime": "11:00",
  "checkoutTime": "08:30",
  "priceRange": "$$",
  "currenciesAccepted": "COP",
  "paymentAccepted": "Cash, Credit Card",
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Aire acondicionado", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Smart TV", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Baño privado", "value": true },
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47",
    "bestRating": "5",
    "worstRating": "1",
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Camila Torres" },
      "reviewBody": "Un lugar increíble en el Caribe colombiano. La habitación familiar muy cómoda, con todo lo necesario. Johana es una anfitriona excepcional.",
      "datePublished": "2025-12-15",
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Santiago Pérez" },
      "reviewBody": "Sapzurro es mágico y La Mariela lo hace aún mejor. Aire acondicionado excelente, WiFi funciona muy bien para lo remoto del lugar.",
      "datePublished": "2025-11-20",
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "María José Restrepo" },
      "reviewBody": "Lo mejor de Sapzurro. Habitaciones limpias, frescas y con todo el confort. El desayuno delicioso y la ubicación perfecta para familias.",
      "datePublished": "2025-10-05",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
