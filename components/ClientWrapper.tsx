"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// 在客户端动态导入HeicConverter组件
const HeicConverter = dynamic(() => import("./HeicConverter"), {
  loading: () => (
    <div className="text-center py-8">
      <p className="mb-4">Loading HEIC to PDF converter...</p>
      <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function ClientWrapper() {
  // 客户端安全使用new Date()
  const [currentYear] = useState(() => new Date().getFullYear());

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-start gap-4 items-center">
          <img
            src="/favicon.svg"
            alt="heic to pdf online converter"
            className="w-10 h-10"
          />
          <div className="text-xl font-bold">HEIC to PDF</div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            HEIC to PDF Online Converter
          </h1>
          <p className="text-center mb-8 text-gray-600">
            Use our free HEIC to PDF tool to convert your HEIC images to PDF
            files in seconds. Batch HEIC to PDF conversion supported, no file
            size limits, and all processing is done locally in your browser.
          </p>

          <HeicConverter />

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Why Use HEIC to PDF?
            </h2>
            <p className="mb-6 text-gray-700">
              HEIC to PDF conversion makes your Apple device images more
              accessible and shareable. Our HEIC to PDF converter is fast,
              secure, and works entirely in your browser. No uploads, no privacy
              concerns—just simple, high-quality HEIC to PDF conversion.
            </p>

            <h2 className="text-xl font-bold mb-4">
              Key Features of Our HEIC to PDF Tool
            </h2>

            <h3 className="text-lg font-bold mb-3">
              Batch HEIC to PDF Conversion
            </h3>
            <p className="mb-4 text-gray-700">
              Upload multiple HEIC files and convert them to PDF in one click.
              Our HEIC to PDF tool saves you time and effort.
            </p>

            <h3 className="text-lg font-bold mb-3">Privacy Protection</h3>
            <p className="mb-4 text-gray-700">
              All HEIC to PDF processing is done locally in your browser. Your
              files never leave your device.
            </p>

            <h3 className="text-lg font-bold mb-3">High Quality Output</h3>
            <p className="mb-4 text-gray-700">
              Our HEIC to PDF converter preserves the original image quality.
              The output PDF looks just like your original HEIC files.
            </p>

            <h2 className="text-xl font-bold mb-4">
              How to Convert HEIC to PDF
            </h2>
            <ol className="list-decimal list-inside mb-8 space-y-2">
              <li>Upload your HEIC files using our HEIC to PDF converter.</li>
              <li>The system processes your images without quality loss.</li>
              <li>
                Once done, the PDF files are automatically downloaded to your
                device.
              </li>
              <li>
                No registration required. 100% free HEIC to PDF conversion.
              </li>
            </ol>

            <h2 className="text-xl font-bold mb-4">HEIC to PDF FAQ</h2>
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-bold">What is a HEIC file?</h3>
                <p className="text-gray-700">
                  HEIC (High Efficiency Image Container) is Apple's
                  implementation of the HEIF (High Efficiency Image Format)
                  standard. Use our HEIC to PDF tool to make these images more
                  compatible.
                </p>
              </div>
              <div>
                <h3 className="font-bold">Why convert HEIC to PDF?</h3>
                <p className="text-gray-700">
                  PDF files are universally compatible. HEIC to PDF conversion
                  ensures your images can be viewed and shared anywhere.
                </p>
              </div>
              <div>
                <h3 className="font-bold">
                  Is my data safe with your HEIC to PDF tool?
                </h3>
                <p className="text-gray-700">
                  Yes! All HEIC to PDF conversions are performed locally in your
                  browser. Your files are never uploaded, ensuring maximum
                  privacy and security.
                </p>
              </div>
              <div>
                <h3 className="font-bold">
                  Is there a file size limit for HEIC to PDF?
                </h3>
                <p className="text-gray-700">
                  No limit. Batch HEIC to PDF conversion is supported.
                </p>
              </div>
              <div>
                <h3 className="font-bold">
                  Will I lose image quality during HEIC to PDF conversion?
                </h3>
                <p className="text-gray-700">
                  No, our HEIC to PDF converter preserves the original image
                  quality. The output PDF will look the same as your original
                  HEIC file.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">
              Why Choose Our HEIC to PDF Converter?
            </h2>
            <ul className="list-disc list-inside mb-8 space-y-2">
              <li>
                Completely free HEIC to PDF conversion, fast, and no file size
                limits
              </li>
              <li>
                No software installation required, all HEIC to PDF processing is
                done in your browser for better security
              </li>
              <li>
                Convert multiple HEIC files at once with batch HEIC to PDF
                conversion
              </li>
              <li>User-friendly interface, no technical knowledge needed</li>
              <li>
                High quality output, preserving the clarity of your images
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 text-sm">
            © {currentYear} HEIC to PDF Converter. All rights reserved.
            <div className="mt-2">
              <a
                href="/batch-conversion"
                className="text-blue-500 hover:underline mx-2"
              >
                HEIC to PDF Batch Conversion
              </a>
              <a
                href="/how-to-use"
                className="text-blue-500 hover:underline mx-2"
              >
                How to Use HEIC to PDF
              </a>
              <a href="/faq" className="text-blue-500 hover:underline mx-2">
                HEIC to PDF FAQ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
