import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEIC to PDF | 在线转换工具",
  description: "在线将HEIC图像转换为PDF文件，保持原始质量且安全无需安装软件",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
