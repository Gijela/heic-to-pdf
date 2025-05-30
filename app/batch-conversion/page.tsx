export const runtime = "edge";

import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Batch HEIC to PDF - HEIC to PDF Online Tool",
  description:
    "Free batch convert multiple HEIC images to PDF documents quickly and efficiently. No server upload, privacy protected, unlimited file size.",
  keywords:
    "batch HEIC to PDF, batch convert HEIC, multiple images to PDF, HEIC one-click PDF",
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
          Batch HEIC to PDF
        </h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            One-Click Batch Conversion, Fast and Efficient
          </h2>
          <p className="text-gray-700 mb-2">
            This tool allows you to upload multiple HEIC images at once and
            batch convert them to PDF documents. All operations are performed
            locally in your browser, with no server upload, ensuring your
            privacy.
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Supports batch drag-and-drop upload of HEIC files</li>
            <li>Choose to merge into a single PDF or export separate PDFs</li>
            <li>Fast conversion, unlimited file size</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            How to Use Batch Conversion?
          </h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            <li>
              Click "Select Files" or drag and drop HEIC images into the upload
              area
            </li>
            <li>You can continue to add more images, batch upload supported</li>
            <li>
              Select "Merge PDF" to combine all images into a single PDF
              document
            </li>
            <li>
              Click the "Convert" button, the system will process and download
              the PDF files automatically
            </li>
          </ol>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">FAQ</h2>
          <h3 className="font-bold mt-4">
            Are there any limits on the number or size of files?
          </h3>
          <p className="text-gray-700">
            No limits. You can batch upload and convert any number and size of
            HEIC images.
          </p>
          <h3 className="font-bold mt-4">
            Will batch conversion affect image quality?
          </h3>
          <p className="text-gray-700">
            No, all conversions preserve the original image quality.
          </p>
          <h3 className="font-bold mt-4">Are my files uploaded to a server?</h3>
          <p className="text-gray-700">
            No, all processing is done locally in your browser for maximum
            privacy.
          </p>
        </section>
      </main>
    </>
  );
}
