import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ulartanggaz.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ular TanggaZ — Sky Island Multiplayer Party Board Game",
    template: "%s | Ular TanggaZ",
  },
  description:
    "Mainkan Ular TanggaZ gratis di browser! Reimaginasi modern game papan Ular Tangga dengan Action Cards, Dynamic Weather Events, Final Dash 91–100, Vs. Bots, Pass & Play, dan Online Party Room.",
  keywords: [
    "Ular TanggaZ",
    "Ular Tangga Online",
    "Snakes and Ladders Multiplayer",
    "Party Board Game",
    "Game Papan Keluarga",
    "Next.js Board Game",
    "Pass and Play",
    "Sky Island Adventure",
  ],
  authors: [{ name: "Yuma Studio", url: "https://yumastudio.digital/" }],
  creator: "Yuma Studio",
  publisher: "Yuma Studio",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.jpg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.svg",
    apple: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "Ular TanggaZ",
    title: "Ular TanggaZ — Sky Island Multiplayer Party Board Game",
    description:
      "Balapan seru dari kotak 1 sampai Mahkota 100! Pakai kartu Double Roll, Ladder Builder, Banana Peel, Friendly Swap & Snake Whistle bareng teman atau AI Bot.",
    images: [
      {
        url: "/logo.jpg",
        width: 1024,
        height: 1024,
        alt: "Ular TanggaZ — Sky Island Party Board Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ular TanggaZ — Sky Island Multiplayer Party Board Game",
    description:
      "Ular Tangga modern penuh twist seru! Action Cards, Dynamic Weather setiap 5 ronde, dan Online Party Room dengan kode 4 huruf.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "games",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1A3308",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Ular TanggaZ",
  alternateName: "Ular TanggaZ: Sky Island Adventure",
  description:
    "A vibrant, family-friendly multiplayer tabletop party board game reimagining Snakes and Ladders with Action Cards, Dynamic Weather Events, and Online Party Rooms.",
  genre: ["Board Game", "Party Game", "Family", "Multiplayer"],
  playMode: ["SinglePlayer", "MultiPlayer", "CoOp"],
  applicationCategory: "Game",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-amber-300 selection:text-slate-900 overscroll-none">
        {children}
      </body>
    </html>
  );
}
