import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEIC to PDF Online Tool | Free Batch Convert HEIC Images to PDF",
  description:
    "A professional online HEIC to PDF converter. Free batch conversion, no server upload, privacy protected, high-quality output.",
  keywords:
    "HEIC to PDF, HEIC converter, online HEIC conversion, batch HEIC to PDF",
  alternates: {
    canonical: "https://heictopdf.tech/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="title" content="HEIC to PDF Online Converter Icon" />
        <meta
          name="description"
          content="Favicon for HEIC to PDF online converter, showing image to PDF transformation."
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
