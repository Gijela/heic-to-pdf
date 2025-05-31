export const runtime = "edge";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Batch HEIC to PDF – Convert Multiple Images Fast",
  description:
    "Convert hundreds of HEIC images to PDF in seconds. Batch HEIC to PDF for professionals, teams, and photographers. Merge, split, and manage large image collections easily.",
  keywords:
    "batch heic to pdf, bulk heic to pdf, convert multiple heic, heic to pdf for photographers, heic to pdf for business",
  alternates: {
    canonical: "https://heictopdf.tech/batch-conversion/",
  },
};

export default function BatchConversion() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Batch HEIC to PDF for Power Users
        </h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Convert Hundreds of HEIC Images at Once
          </h2>
          <p className="text-gray-700 mb-2">
            Our batch HEIC to PDF tool is designed for professionals, teams, and
            anyone managing large photo collections. Upload as many HEIC files
            as you need—no limits, no waiting, no privacy worries.
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Drag-and-drop batch upload for fast workflow</li>
            <li>Merge all images into a single PDF or export separate PDFs</li>
            <li>Perfect for photographers, designers, and business users</li>
            <li>All processing is local—your files never leave your device</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Best Practices for Batch HEIC to PDF
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              Organize your HEIC files into folders before uploading for easier
              management
            </li>
            <li>
              Use the "Merge PDF" option for multi-page documents, ideal for
              portfolios or reports
            </li>
            <li>Check output settings for custom page size and layout</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Batch Conversion FAQ</h2>
          <h3 className="font-bold mt-4">
            Is there a limit to the number of HEIC files I can convert?
          </h3>
          <p className="text-gray-700">
            No, our batch HEIC to PDF tool supports unlimited files and file
            sizes.
          </p>
          <h3 className="font-bold mt-4">
            Will batch conversion affect image quality?
          </h3>
          <p className="text-gray-700">
            No, all images retain their original quality after conversion.
          </p>
          <h3 className="font-bold mt-4">Who should use batch HEIC to PDF?</h3>
          <p className="text-gray-700">
            Ideal for photographers, businesses, educators, and anyone needing
            to process large numbers of images quickly.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
