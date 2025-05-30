export const runtime = "edge";

import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HEIC to PDF FAQ - HEIC to PDF Online Tool",
  description:
    "Answers to common questions about HEIC to PDF conversion, including file size limits, privacy, quality, and batch processing. Learn everything about heic to pdf.",
  keywords:
    "heic to pdf, heic to pdf faq, heic conversion questions, heic file to pdf help, heic to pdf support",
  alternates: {
    canonical: "https://heictopdf.tech/faq/",
  },
};

export default function FAQ() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">HEIC to PDF FAQ</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Frequently Asked Questions about HEIC to PDF
          </h2>
          <p className="text-gray-700 mb-2">
            Find answers to the most common questions about heic to pdf
            conversion, privacy, quality, and more.
          </p>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              What is a HEIC file and why use HEIC to PDF?
            </h3>
            <p className="text-gray-700">
              HEIC (High Efficiency Image Container) is a format commonly used
              by Apple devices, offering high compression and image quality. Use
              our heic to pdf tool to make your images more accessible.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">Why convert HEIC to PDF?</h3>
            <p className="text-gray-700">
              PDF is a universal format, easy to view, archive, and share across
              all devices and platforms. HEIC to PDF conversion ensures
              compatibility.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Is the heic to pdf conversion process safe?
            </h3>
            <p className="text-gray-700">
              All heic to pdf conversions are performed locally in your browser.
              Files are never uploaded to any server, ensuring privacy.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Are there any file size or number limits for heic to pdf?
            </h3>
            <p className="text-gray-700">
              No limits. You can batch upload and convert any number and size of
              HEIC images to PDF using our heic to pdf tool.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Will the image quality decrease after heic to pdf conversion?
            </h3>
            <p className="text-gray-700">
              No, the heic to pdf conversion process preserves the original
              image quality. The output PDF is clear and usable.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Can I merge multiple HEIC files into one PDF with heic to pdf?
            </h3>
            <p className="text-gray-700">
              Yes, simply check the "Merge PDF" option to combine multiple
              images into a single multi-page PDF document using our heic to pdf
              converter.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Which operating systems and browsers are supported for heic to
              pdf?
            </h3>
            <p className="text-gray-700">
              Works on Windows, Mac, iOS, Android, and all modern browsers. HEIC
              to PDF is available everywhere.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Where are the converted files saved after heic to pdf?
            </h3>
            <p className="text-gray-700">
              After heic to pdf conversion, the PDF files are automatically
              downloaded to your device's "Downloads" folder.
            </p>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            More Help on HEIC to PDF
          </h2>
          <p className="text-gray-700">
            For detailed instructions, please see the{" "}
            <a href="/how-to-use" className="text-blue-600 underline">
              How to Use HEIC to PDF
            </a>{" "}
            page.
          </p>
        </section>
      </main>
    </>
  );
}
