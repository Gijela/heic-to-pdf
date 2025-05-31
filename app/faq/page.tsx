export const runtime = "edge";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HEIC to PDF FAQ - Advanced Questions & Support",
  description:
    "Expert answers to advanced questions about HEIC to PDF conversion: metadata, editing, compatibility, privacy, and more. Get the most out of your heic to pdf workflow.",
  keywords:
    "heic to pdf, heic to pdf faq, advanced heic to pdf, heic metadata, heic to pdf editing, privacy, compatibility",
  alternates: {
    canonical: "https://heictopdf.tech/faq/",
  },
};

export default function FAQ() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          HEIC to PDF – Advanced FAQ
        </h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Expert Answers for HEIC to PDF Users
          </h2>
          <p className="text-gray-700 mb-2">
            Explore advanced topics and troubleshooting for heic to pdf
            conversion. For basic usage, see our How-To page.
          </p>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Can I edit the PDF after converting from HEIC?
            </h3>
            <p className="text-gray-700">
              Yes, the PDF output from our heic to pdf tool can be opened and
              edited in any standard PDF editor.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Does HEIC to PDF conversion keep EXIF or metadata?
            </h3>
            <p className="text-gray-700">
              By default, sensitive metadata is removed for privacy, but you can
              choose to retain it in advanced settings.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              What if my PDF looks different from the original HEIC?
            </h3>
            <p className="text-gray-700">
              Check your export settings for page size, scaling, and cropping.
              Our heic to pdf converter offers multiple options to match your
              needs.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Can I convert HEIC to PDF on mobile devices?
            </h3>
            <p className="text-gray-700">
              Yes, our heic to pdf tool works on iOS, Android, and all modern
              browsers—no app required.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Is batch conversion or PDF merging supported?
            </h3>
            <p className="text-gray-700">
              Absolutely. You can batch convert and merge multiple HEIC images
              into a single PDF or export them separately.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              Can I automate heic to pdf conversion for large workflows?
            </h3>
            <p className="text-gray-700">
              For power users, our tool supports drag-and-drop batch processing.
              For API or automation, please contact us for enterprise solutions.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mt-4">
              What about color profiles and print quality?
            </h3>
            <p className="text-gray-700">
              Our converter preserves color accuracy for both digital and
              print-ready PDFs. For best results, use high-resolution HEIC
              files.
            </p>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Need More Help?</h2>
          <p className="text-gray-700">
            For step-by-step instructions, visit the{" "}
            <a href="/how-to-use" className="text-blue-600 underline">
              How to Use HEIC to PDF
            </a>{" "}
            page, or contact our support team.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
