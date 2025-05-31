import HeicConverter from "@/components/HeicConverter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            The Ultimate HEIC to PDF Converter Online
          </h1>
          <p className="text-center mb-8 text-gray-600">
            Instantly convert HEIC images to PDF with our advanced,
            privacy-first online tool. No uploads, no registration, no
            limits—just fast, secure, and high-quality HEIC to PDF conversion in
            your browser. Perfect for individuals, professionals, and teams.
          </p>

          <HeicConverter />

          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">
              Who Can Benefit from HEIC to PDF Conversion?
            </h2>
            <p className="mb-6 text-gray-700">
              Our HEIC to PDF tool is perfect for students submitting
              assignments, business professionals sharing reports, designers
              preparing print files, and anyone who needs to make Apple device
              photos universally accessible. Whether you're working with a
              single image or an entire photo library, our converter adapts to
              your workflow.
            </p>
            <h2 className="text-xl font-bold mb-4">
              Cutting-Edge Technology for HEIC to PDF
            </h2>
            <p className="mb-6 text-gray-700">
              Powered by the latest browser-based image processing technology,
              our HEIC to PDF converter delivers instant results without
              uploading your files to any server. Enjoy lightning-fast
              conversion, robust privacy, and compatibility with all major
              operating systems and browsers.
            </p>
            <h2 className="text-xl font-bold mb-4">
              Eco-Friendly & Privacy-First
            </h2>
            <p className="mb-6 text-gray-700">
              By processing everything locally, our HEIC to PDF tool reduces
              energy consumption and carbon footprint compared to cloud-based
              converters. Your data never leaves your device, ensuring full
              compliance with privacy regulations worldwide.
            </p>
            <h2 className="text-xl font-bold mb-4">Always Improving</h2>
            <p className="mb-6 text-gray-700">
              We are committed to providing the best HEIC to PDF experience. New
              features, format support, and performance improvements are
              released regularly. Bookmark this page for the latest and most
              reliable HEIC to PDF conversion.
            </p>
            <h2 className="text-xl font-bold mb-4">
              Why Choose Us Over Other HEIC to PDF Tools?
            </h2>
            <p className="mb-6 text-gray-700">
              Unlike many online converters, we never upload your files, never
              require registration, and never limit your usage. Our HEIC to PDF
              tool is 100% free, ad-free, and trusted by users worldwide.
            </p>
            <h2 className="text-xl font-bold mb-6">
              Why Choose Our HEIC to PDF Tool?
            </h2>
            <ul className="list-disc list-inside mb-8 space-y-2 text-gray-700">
              <li>100% free and unlimited HEIC to PDF conversion</li>
              <li>
                All processing is local—your images never leave your device
              </li>
              <li>Batch convert multiple HEIC files to PDF in one click</li>
              <li>Merge images into a single PDF or export separate files</li>
              <li>
                Preserves original image quality, supports advanced settings
              </li>
              <li>
                No software installation, works on all platforms and browsers
              </li>
            </ul>
            <h2 className="text-xl font-bold mb-4">
              HEIC to PDF: Fast, Private, Reliable
            </h2>
            <p className="mb-6 text-gray-700">
              Our HEIC to PDF converter is trusted by thousands of users
              worldwide. Whether you need to archive, share, or print your Apple
              device photos, our tool delivers professional results every time.
            </p>
            <h2 className="text-xl font-bold mb-4">Quick FAQ</h2>
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-bold">Is my data safe?</h3>
                <p className="text-gray-700">
                  Yes, all HEIC to PDF conversion happens in your browser. No
                  uploads, no tracking, total privacy.
                </p>
              </div>
              <div>
                <h3 className="font-bold">Are there any limits?</h3>
                <p className="text-gray-700">
                  No file size or number limits. Convert as many HEIC images to
                  PDF as you need.
                </p>
              </div>
              <div>
                <h3 className="font-bold">Will I lose image quality?</h3>
                <p className="text-gray-700">
                  No, our HEIC to PDF tool preserves the original quality of
                  your images.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
