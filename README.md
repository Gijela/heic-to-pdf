# HEIC to PDF Online Tool

This project is a pure front-end HEIC to PDF online tool based on Next.js, supporting batch conversion, PDF merging, privacy-friendly local processing, and other advanced features. All image processing is done locally in the browser—no upload, no registration, and always free.

## Features

- **HEIC to PDF/JPEG**: Supports batch conversion of HEIC images from Apple devices to PDF or JPEG formats.
- **Batch Processing**: Upload and convert multiple HEIC files at once, with no limit on quantity or size.
- **PDF Merging**: Choose to merge multiple images into a single multi-page PDF, or export each as separate PDF files.
- **Advanced Settings**: Customize image size, page size (A4, Letter, original), cropping/scaling, metadata removal, and more.
- **Privacy & Security**: All conversion and processing are done locally in your browser. Images are never uploaded to any server, ensuring user privacy.
- **Cross-Platform Compatibility**: Works on Windows, macOS, Linux, and all major browsers and mobile devices.
- **No Installation/Registration Required**: Ready to use instantly, with no ads, no watermarks, and no feature restrictions.

## Quick Start

1. Open the homepage and click "Upload Files" or drag HEIC images into the conversion area.
2. You can continue adding more images for batch conversion.
3. To merge into a single PDF, check the "Merge PDF" option.
4. Click "Convert" and the PDF file(s) will be automatically downloaded locally.

## Advanced Usage

- Use "Advanced Settings" to adjust page size, image scaling, whether to keep metadata, and more.
- Supports batch conversion and merging, suitable for photographers, designers, enterprise users, and other large-scale image processing scenarios.
- All processing is done locally, ideal for users with high privacy requirements.

## FAQ

- **What files are supported?** Only .heic images are supported, with a maximum size of 10MB per file.
- **Can the converted PDF be edited?** Yes, the exported PDF can be opened and edited with any standard PDF editor.
- **Is mobile supported?** Yes, works on iOS, Android, and all modern browsers.
- **How is the image quality?** Original image quality is preserved by default, and can be adjusted in advanced settings.

For more questions, please refer to the [User Guide](/how-to-use) and [FAQ](/faq).

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- heic2any (HEIC conversion)
- jsPDF (PDF generation)

## Local Development

```bash
pnpm install
pnpm dev
```

## Deployment

This project supports one-click deployment on platforms like Cloudflare Pages and Vercel.

---

If you need an English version or have other customization needs, please let us know!
