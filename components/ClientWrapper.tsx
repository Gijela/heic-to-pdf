"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// 在客户端动态导入HeicConverter组件
const HeicConverter = dynamic(() => import("./HeicConverter"), {
  loading: () => (
    <div className="text-center py-8">
      <p className="mb-4">正在加载转换工具...</p>
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
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-bold">HEIC to PDF</div>
          <div>
            <button className="text-blue-600 hover:underline">登录</button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            将HEIC转换为PDF
          </h1>
          <p className="text-center mb-8 text-gray-600">
            几秒钟内将HEIC图像转换为PDF或JPEG文件
          </p>

          <HeicConverter />

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              在线将HEIC转换为PDF或JPEG
            </h2>
            <p className="mb-6 text-gray-700">
              HEIC图像格式是Apple在iOS设备上使用的图像格式。它代表高效图像格式。HEIC提供了很好的压缩和质量，但它并不被广泛支持。我们的转换器将您的HEIC图像转换为PDF或JPEG，使它们更加通用。
            </p>

            <h3 className="text-xl font-bold mb-4">转换过程如何工作</h3>
            <ol className="list-decimal list-inside mb-8 space-y-2">
              <li>通过我们的安全平台上传您的HEIC文件。</li>
              <li>选择您想要的输出格式（PDF或JPEG）。</li>
              <li>我们的系统处理图像，不影响原始质量。</li>
              <li>文件会自动下载到您的设备。</li>
            </ol>

            <h3 className="text-xl font-bold mb-4">常见问题</h3>
            <div className="space-y-4 mb-8">
              <div>
                <h4 className="font-bold">什么是HEIC文件？</h4>
                <p className="text-gray-700">
                  HEIC（高效图像容器）是Apple对HEIF（高效图像格式）标准的实现。它提供比JPEG更好的压缩效果，同时保持更高的图像质量。
                </p>
              </div>
              <div>
                <h4 className="font-bold">为什么要将HEIC转换为PDF或JPEG？</h4>
                <p className="text-gray-700">
                  PDF和JPEG文件在所有设备和平台上都通用。转换为这些格式确保您的图像可以在任何地方查看，并使分享变得更加容易。
                </p>
              </div>
              <div>
                <h4 className="font-bold">我的数据安全吗？</h4>
                <p className="text-gray-700">
                  是的！所有转换都在您的浏览器中本地完成，您的文件不会上传到我们的服务器。这确保了最大的隐私和安全性。
                </p>
              </div>
              <div>
                <h4 className="font-bold">最大文件大小是多少？</h4>
                <p className="text-gray-700">
                  免费用户可以转换最大10MB的HEIC文件。高级用户可以转换最大100MB的文件。
                </p>
              </div>
              <div>
                <h4 className="font-bold">我会丢失图像质量吗？</h4>
                <p className="text-gray-700">
                  不会，我们的转换过程保持原始图像质量。输出的文件将与原始HEIC文件看起来相同。
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">为什么使用我们的转换器？</h3>
            <ul className="list-disc list-inside mb-8 space-y-2">
              <li>快速高效的转换</li>
              <li>保持原始质量</li>
              <li>完全在浏览器中处理，更安全</li>
              <li>无需安装软件</li>
              <li>支持多种输出格式</li>
            </ul>

            <div className="bg-gray-100 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-4">高级功能</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>一次转换多个HEIC文件</li>
                <li>转换最大100MB的文件</li>
                <li>批量转换功能</li>
                <li>更多输出格式选择</li>
              </ul>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                获取高级版
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 text-sm">
            © {currentYear} HEIC to PDF 转换器。保留所有权利。
            <div className="mt-2 space-x-4">
              <Link href="#" className="hover:underline">
                价格
              </Link>
              <Link href="#" className="hover:underline">
                隐私
              </Link>
              <Link href="#" className="hover:underline">
                条款
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
