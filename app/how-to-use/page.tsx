export const runtime = "edge";

import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use HEIC to PDF - HEIC to PDF Online Tool",
  description:
    "Step-by-step guide on how to use the HEIC to PDF tool, including batch conversion, PDF merging, and advanced settings. Learn how to convert HEIC to PDF easily.",
  keywords:
    "heic to pdf, heic to pdf guide, heic conversion tutorial, batch heic to pdf, how to use heic to pdf",
  alternates: {
    canonical: "https://heictopdf.tech/how-to-use/",
  },
};

export default function HowToUse() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          How to Use HEIC to PDF Converter
        </h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Quick Start: HEIC to PDF
          </h2>
          <p className="text-gray-700 mb-2">
            Follow these steps to convert HEIC to PDF using our online HEIC to
            PDF tool:
          </p>
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            <li>
              Open the homepage and click "Select Files" or drag and drop HEIC
              images into the upload area of the HEIC to PDF converter
            </li>
            <li>
              You can continue to add more HEIC images, batch upload supported
              for HEIC to PDF
            </li>
            <li>
              To merge into a single PDF, check the "Merge PDF" option in the
              HEIC to PDF tool
            </li>
            <li>
              Click the "Convert" button, and the system will process and
              download the PDF files automatically
            </li>
          </ol>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Batch HEIC to PDF Conversion & PDF Merging
          </h2>
          <h3 className="font-bold mt-4">Batch HEIC to PDF Conversion</h3>
          <p className="text-gray-700 mb-2">
            Upload multiple HEIC files at once and convert them to PDF in bulk
            for maximum efficiency. Our HEIC to PDF tool makes batch conversion
            easy.
          </p>
          <h3 className="font-bold mt-4">PDF Merging with HEIC to PDF</h3>
          <p className="text-gray-700 mb-2">
            Check "Merge PDF" to combine all images into a single multi-page PDF
            document using the HEIC to PDF converter, perfect for organizing and
            archiving.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Advanced HEIC to PDF Settings
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              PDF Page Size: Choose between image size, A4, or Letter standard
              in the HEIC to PDF tool
            </li>
            <li>
              Metadata Handling: Choose to keep or remove image metadata such as
              camera info and GPS during HEIC to PDF conversion
            </li>
            <li>
              Image Size Adjustment: Customize output width and height, with
              options for max fit, crop, or scale in the HEIC to PDF converter
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">HEIC to PDF FAQ & Tips</h2>
          <h3 className="font-bold mt-4">
            How to ensure HEIC to PDF conversion quality?
          </h3>
          <p className="text-gray-700">
            By default, the original image quality is preserved. The output PDF
            is clear and usable after HEIC to PDF conversion.
          </p>
          <h3 className="font-bold mt-4">
            Is the HEIC to PDF conversion process safe?
          </h3>
          <p className="text-gray-700">
            All processing is done locally in your browser. Files are never
            uploaded to any server during HEIC to PDF conversion.
          </p>
          <h3 className="font-bold mt-4">
            Which devices are supported for HEIC to PDF?
          </h3>
          <p className="text-gray-700">
            Works on Windows, Mac, iOS, Android, and all major browsers. HEIC to
            PDF conversion is available everywhere.
          </p>
        </section>
      </main>
    </>
  );
}
