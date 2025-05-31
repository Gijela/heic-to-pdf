export const runtime = "edge";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use HEIC to PDF – Step-by-Step Guide",
  description:
    "Learn how to convert HEIC to PDF with our online tool. Step-by-step instructions, batch conversion, merging, and advanced settings for the best heic to pdf results.",
  keywords:
    "heic to pdf, how to use heic to pdf, heic to pdf tutorial, batch heic to pdf, heic to pdf tips",
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
          How to Use the HEIC to PDF Converter
        </h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Quick Start Guide</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            <li>
              Go to the homepage and click “Upload Files” or drag HEIC images
              into the converter area.
            </li>
            <li>
              Optionally, add more images for batch HEIC to PDF conversion.
            </li>
            <li>
              To merge all images into one PDF, check the “Merge PDF” option.
            </li>
            <li>
              Click “Convert” and your PDF(s) will be downloaded automatically.
            </li>
          </ol>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Advanced Tips & Tricks</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              Use the advanced settings to adjust PDF page size, image scaling,
              and metadata handling.
            </li>
            <li>
              For best quality, upload original HEIC files (avoid screenshots or
              compressed images).
            </li>
            <li>
              Batch conversion is ideal for organizing photo albums or archiving
              Apple device images.
            </li>
            <li>Use the “Crop” or “Scale” options for custom PDF layouts.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Common Mistakes to Avoid
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              Uploading non-HEIC files—only HEIC images are supported for
              conversion.
            </li>
            <li>
              Forgetting to check “Merge PDF” if you want a single document.
            </li>
            <li>Not reviewing advanced settings for special output needs.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Need More Help?</h2>
          <p className="text-gray-700">
            For advanced troubleshooting, see our{" "}
            <a href="/faq" className="text-blue-600 underline">
              HEIC to PDF FAQ
            </a>{" "}
            or contact support.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
