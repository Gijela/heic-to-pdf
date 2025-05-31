const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 text-sm">
          © 2025 HEIC to PDF Converter. All rights reserved.
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
  );
};

export default Footer;
