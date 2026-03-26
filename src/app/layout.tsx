import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

//! FINISH UP POLISHING THE INFORMATIONS IN. JSON-LD, ESPECIALLY THE SAMEAS LINKS. ALSO CONSIDER ADDING CONTACTPOINTS, ADDRESS, AND OTHER RELEVANT SCHEMA PROPERTIES.

/**
 * Root layout — document shell owned at the app root for stable hydration.
 * Locale-specific providers and routing live in app/[locale]/layout.tsx.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Hainan Infrastructure Partners",
    default: "Hainan Infrastructure Partners",
  },
  // description:"Hainan Infrastructure Partners is a cross-border infrastructure advisory platform supporting transaction execution and capital coordination between Chinese counterparties and international institutional investors.",
  description:"We honor great builders of Infrastructure.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  keywords: [
    "Hainan Infrastructure Partners",
    "Tokenization of Infrastructure",
    "RWA Infrastructure",
    "Infrastructure Financing",
    "Infrastructure Investment",
    "Megainfrastructure",
    "Global Infrastructure",
    "Infrastructure Projects",
    "Infrastructure Innovation",
  ],
};

const playfairDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf",
      style: "normal",
      weight: "400 900",
    },
    {
      path: "../../public/fonts/Playfair_Display/PlayfairDisplay-Italic-VariableFont_wght.ttf",
      style: "italic",
      weight: "400 900",
    },
  ],
  variable: "--font-playfair-display",
  display: "swap",
});

const ebGaramond = localFont({
  src: [
    {
      path: "../../public/fonts/EB_Garamond/EBGaramond-VariableFont_wght.ttf",
      style: "normal",
      weight: "400 800",
    },
    {
      path: "../../public/fonts/EB_Garamond/EBGaramond-Italic-VariableFont_wght.ttf",
      style: "italic",
      weight: "400 800",
    },
  ],
  variable: "--font-eb-garamond",
  display: "swap",
  preload: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define your Core Entity Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hainan Infrastructure Partners',
    url: 'https://hainan-infra.com',
    // logo: 'https://hainan-infra.com/logo.png',
    description: 'Offering tokenization, financing, and investment in global infrastructure projects.',
    employee: [
      {
        '@type': 'Person',
        name: 'Matti Gerber',
        jobTitle: 'Managing Director',
      },
      {
        '@type': 'Person',
        name: 'Dean Zhang',
        jobTitle: 'Partner',
      },
      {
        '@type': 'Person',
        name: 'Ertugrul Kucukkaya',
        jobTitle: 'IT Intern',
      },
    ],
    sameAs: [
      //! UPDATE THESE LINKS TO YOUR ACTUAL SOCIAL PROFILES
      "https://www.linkedin.com/company/hainan-infrastructure-partners/"
    ]
  };
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${ebGaramond.variable} antialiased`}>
        {/* AEO CRITICAL: Hardcoded Entity Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        {children}
      </body>
    </html>
  );
}
