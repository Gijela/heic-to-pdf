"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";

// 创建一个纯客户端组件来处理HEIC转换
export default function HeicConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [outputType, setOutputType] = useState<"jpeg" | "pdf">("pdf");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const uploadedFile = acceptedFiles[0];

    if (uploadedFile) {
      if (uploadedFile.size > 10 * 1024 * 1024) {
        // 10MB限制
        setError("文件大小超过10MB限制");
        return;
      }

      if (!uploadedFile.name.toLowerCase().endsWith(".heic")) {
        setError("请上传HEIC格式的文件");
        return;
      }

      setFile(uploadedFile);
    }
  }, []);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputType(e.target.value as "jpeg" | "pdf");
  };

  const removeExtension = (imgName: string) => {
    if (imgName.toLowerCase().endsWith(".heic")) {
      return imgName.substring(0, imgName.length - 5);
    }
    return imgName;
  };

  // 转换文件 - 关键修改：延迟导入库
  const convertFile = async () => {
    if (!file) return;

    setConverting(true);
    setError(null);

    try {
      // 读取文件
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          if (!reader.result) {
            throw new Error("读取文件失败");
          }

          const imgData = reader.result as string;
          const imgName = removeExtension(file.name);

          const response = await fetch(imgData);
          const blob = await response.blob();

          // 延迟导入 heic2any
          console.log("准备导入 heic2any...");
          let heic2anyModule;
          try {
            // 动态导入
            const importedModule = await import("heic2any");
            heic2anyModule = importedModule.default;
            console.log("heic2any 导入成功", heic2anyModule);
          } catch (importErr) {
            console.error("导入 heic2any 失败:", importErr);
            setError("加载转换模块失败");
            setConverting(false);
            return;
          }

          // 使用heic2any进行转换
          let conversionResult;
          try {
            console.log("开始转换HEIC文件...");
            conversionResult = await heic2anyModule({
              blob,
              toType: "image/jpeg",
              quality: 0.5,
            });
            console.log("HEIC转换成功");
          } catch (convErr) {
            console.error("HEIC转换错误:", convErr);
            setError("HEIC转换失败");
            setConverting(false);
            return;
          }

          const url = URL.createObjectURL(conversionResult as Blob);

          if (outputType === "jpeg") {
            // 下载JPEG文件
            downloadURI(url, imgName + ".jpeg");
            URL.revokeObjectURL(url);
            setConverting(false);
          } else {
            // 延迟导入 jsPDF
            let jsPDFModule;
            try {
              const jspdfImport = await import("jspdf");
              jsPDFModule = jspdfImport.jsPDF;
              console.log("jsPDF 导入成功");
            } catch (jspdfErr) {
              console.error("导入 jsPDF 失败:", jspdfErr);
              setError("加载PDF生成模块失败");
              URL.revokeObjectURL(url);
              setConverting(false);
              return;
            }

            // 创建PDF
            const img = new Image();
            img.src = url;

            img.onload = () => {
              try {
                console.log("开始创建PDF...");
                const doc = new jsPDFModule();
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                // 计算图片纵横比
                const imgRatio = img.width / img.height;
                const pageRatio = pageWidth / pageHeight;

                let imgWidth, imgHeight;
                let x = 0,
                  y = 0;

                // 根据纵横比决定如何缩放图片
                if (imgRatio > pageRatio) {
                  // 图片更宽，以宽度为基准
                  imgWidth = pageWidth;
                  imgHeight = imgWidth / imgRatio;
                  // 垂直居中
                  y = (pageHeight - imgHeight) / 2;
                } else {
                  // 图片更高，以高度为基准
                  imgHeight = pageHeight;
                  imgWidth = imgHeight * imgRatio;
                  // 水平居中
                  x = (pageWidth - imgWidth) / 2;
                }

                doc.addImage(url, "JPEG", x, y, imgWidth, imgHeight);
                doc.save(imgName + ".pdf");
                console.log("PDF创建完成");
              } catch (pdfErr) {
                console.error("PDF生成错误:", pdfErr);
                setError("PDF生成失败");
              } finally {
                // 释放URL
                URL.revokeObjectURL(url);
                setConverting(false);
              }
            };

            img.onerror = () => {
              console.error("图像加载错误");
              URL.revokeObjectURL(url);
              setError("图像处理失败");
              setConverting(false);
            };
          }
        } catch (err) {
          console.error("转换错误:", err);
          setError("转换失败，请重试");
          setConverting(false);
        }
      };

      reader.onerror = () => {
        setError("读取文件失败");
        setConverting(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("处理错误:", err);
      setError(err instanceof Error ? err.message : "处理文件时出错");
      setConverting(false);
    }
  };

  // 下载文件工具函数
  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/heic": [".heic"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="mb-8">
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-500"
            }`}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            <p className="mb-4">将您的HEIC文件拖放到此处或</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              浏览文件
            </button>
            <p className="mt-4 text-sm text-gray-500">最大文件大小：10 MB</p>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="text-red-600 hover:text-red-800"
              >
                移除文件
              </button>
            </div>
          </div>
        )}

        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
      </div>

      <div className="mb-4 text-center">
        <div className="inline-flex items-center space-x-4">
          <span className="text-gray-700">输出格式:</span>
          <select
            value={outputType}
            onChange={handleOptionChange}
            className="bg-white border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pdf">PDF</option>
            <option value="jpeg">JPEG</option>
          </select>
        </div>
      </div>

      <div className="text-center mb-8">
        <button
          onClick={convertFile}
          disabled={!file || converting}
          className={`px-6 py-3 rounded-md font-medium text-white transition-colors ${
            !file || converting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {converting ? "转换中..." : `转换为${outputType.toUpperCase()}`}
        </button>

        <p className="mt-4 text-sm text-gray-500">
          您同意我们的{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            条款和隐私政策
          </Link>
        </p>
      </div>
    </>
  );
}
