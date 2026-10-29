import type { Metadata } from "next";
import { Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Sora is a variable font, so one file covers every weight we use (400–800).
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

// Icons (app/icon.svg, apple-icon.png, favicon.ico) and the social share image
// (app/opengraph-image.png) are picked up automatically from the app folder.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.compoundingwins.com"),
  title: "Compounding Wins | Digital Marketing Consultant",
  description:
    "Digital marketing consulting, guides, and tools from Compounding Wins — SEO, social, content, and paid media strategy.",
  openGraph: {
    siteName: "Compounding Wins",
    type: "website",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${sora.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}</Script>
          </>
        )}
        <Script id="reddit-pixel" strategy="afterInteractive">{`
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=a2_iy2syc81ienf",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','a2_iy2syc81ienf');rdt('track','PageVisit');
        `}</Script>
      </body>
    </html>
  );
}
