"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useDropzone } from "react-dropzone";

// 定义图片处理配置类型
type ImageConfig = {
  width: string;
  height: string;
  fit: "max" | "crop" | "scale";
  stripMetadata: boolean;
  pdfPageSize: "image" | "a4" | "letter"; // 添加PDF页面大小选项
};

// 添加文件输出类型的接口
interface FileOutputConfig {
  fileId: string; // 使用文件名或其他唯一标识
  outputType: "jpeg" | "pdf";
}

// 创建一个纯客户端组件来处理HEIC转换
export default function HeicConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [outputType, setOutputType] = useState<"jpeg" | "pdf">("pdf");
  const [pdfMode, setPdfMode] = useState<"separate" | "merge">("separate");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [imageConfig, setImageConfig] = useState<ImageConfig>({
    width: "",
    height: "",
    fit: "max",
    stripMetadata: false,
    pdfPageSize: "image", // 默认使用图片尺寸
  });
  // 新增状态管理每个文件的输出格式
  const [fileOutputs, setFileOutputs] = useState<FileOutputConfig[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      // 过滤出有效的HEIC文件
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          setError("部分文件超过10MB限制");
          return false;
        }

        if (!file.name.toLowerCase().endsWith(".heic")) {
          setError("请仅上传HEIC格式的文件");
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        // 新文件添加到数组前面，实现倒序排列
        setFiles((prevFiles) => [...validFiles, ...prevFiles]);

        // 为新上传的文件设置默认输出格式
        const newOutputConfigs = validFiles.map((file) => ({
          fileId: file.name,
          outputType: outputType,
        }));

        setFileOutputs((prevOutputs) => [...newOutputConfigs, ...prevOutputs]);
      }
    },
    [outputType]
  );

  // 更新单个文件的输出格式
  const handleFileOutputChange = (
    fileId: string,
    newOutputType: "jpeg" | "pdf"
  ) => {
    setFileOutputs((prevOutputs) =>
      prevOutputs.map((config) =>
        config.fileId === fileId
          ? { ...config, outputType: newOutputType }
          : config
      )
    );
  };

  // 检查是否有足够的PDF文件显示合并选项
  const hasPdfMergeOption = useMemo(() => {
    const pdfCount = fileOutputs.filter(
      (config) => config.outputType === "pdf"
    ).length;
    return pdfCount >= 2;
  }, [fileOutputs]);

  // 获取特定文件的输出格式
  const getFileOutputType = (fileId: string): "jpeg" | "pdf" => {
    const fileConfig = fileOutputs.find((config) => config.fileId === fileId);
    return fileConfig?.outputType || outputType;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputType(e.target.value as "jpeg" | "pdf");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const handlePdfModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPdfMode(e.target.value as "separate" | "merge");
  };

  // 处理全局PDF合并模式的变更
  const handlePdfMergeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfMode(e.target.checked ? "merge" : "separate");
  };

  const handleImageConfigChange = (
    field: keyof ImageConfig,
    value: string | boolean
  ) => {
    setImageConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const toggleConfigPanel = () => {
    setShowConfigPanel((prev) => !prev);
  };

  const removeExtension = (imgName: string) => {
    if (imgName.toLowerCase().endsWith(".heic")) {
      return imgName.substring(0, imgName.length - 5);
    }
    return imgName;
  };

  // 应用图片配置
  const applyImageConfig = async (blob: Blob): Promise<Blob> => {
    // 如果没有设置任何配置，直接返回原始blob
    if (
      !imageConfig.width &&
      !imageConfig.height &&
      !imageConfig.stripMetadata
    ) {
      return blob;
    }

    try {
      // 创建canvas用于处理图片
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("无法创建Canvas上下文");
      }

      // 加载图片
      const img = await createImageBitmap(blob);
      let targetWidth = img.width;
      let targetHeight = img.height;

      // 计算目标尺寸
      const configWidth = imageConfig.width ? parseInt(imageConfig.width) : 0;
      const configHeight = imageConfig.height
        ? parseInt(imageConfig.height)
        : 0;

      if (configWidth > 0 || configHeight > 0) {
        // 根据fit模式计算尺寸
        if (imageConfig.fit === "max") {
          // max模式：不超过指定尺寸，但不放大小图
          if (configWidth > 0 && configHeight > 0) {
            // 两个尺寸都指定了
            const scaleWidth = configWidth / img.width;
            const scaleHeight = configHeight / img.height;
            const scale = Math.min(scaleWidth, scaleHeight, 1); // 不超过1防止放大
            targetWidth = Math.floor(img.width * scale);
            targetHeight = Math.floor(img.height * scale);
          } else if (configWidth > 0) {
            // 只指定了宽度
            const scale = Math.min(configWidth / img.width, 1);
            targetWidth = Math.floor(img.width * scale);
            targetHeight = Math.floor(img.height * scale);
          } else if (configHeight > 0) {
            // 只指定了高度
            const scale = Math.min(configHeight / img.height, 1);
            targetWidth = Math.floor(img.width * scale);
            targetHeight = Math.floor(img.height * scale);
          }
        } else if (imageConfig.fit === "crop") {
          // crop模式：填充并裁剪
          targetWidth = configWidth > 0 ? configWidth : img.width;
          targetHeight = configHeight > 0 ? configHeight : img.height;
        } else if (imageConfig.fit === "scale") {
          // scale模式：强制缩放
          targetWidth = configWidth > 0 ? configWidth : img.width;
          targetHeight = configHeight > 0 ? configHeight : img.height;
        }
      }

      // 设置canvas尺寸
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // 清空canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (imageConfig.fit === "crop" && (configWidth > 0 || configHeight > 0)) {
        // 裁剪模式：居中裁剪
        const scale = Math.max(
          targetWidth / img.width,
          targetHeight / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (targetWidth - scaledWidth) / 2;
        const offsetY = (targetHeight - scaledHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      } else {
        // 其他模式：直接绘制
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }

      // 转换回blob
      const quality = 0.92; // 高质量
      const mimeType = "image/jpeg";
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (newBlob) => {
            if (newBlob) {
              resolve(newBlob);
            } else {
              reject(new Error("Canvas转换失败"));
            }
          },
          mimeType,
          quality
        );
      });
    } catch (err) {
      console.error("应用图片配置错误:", err);
      return blob; // 出错时返回原始blob
    }
  };

  // 转换单个文件
  const convertSingleFile = async (
    file: File
  ): Promise<{
    blob: Blob;
    name: string;
    outputType: "jpeg" | "pdf";
  } | null> => {
    try {
      // 设置这个文件的进度为1%
      setProgress((prev) => ({ ...prev, [file.name]: 1 }));

      // 获取此文件的输出格式
      const fileOutputType = getFileOutputType(file.name);

      // 读取文件
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            if (!reader.result) {
              throw new Error("读取文件失败");
            }

            // 更新进度到20%
            setProgress((prev) => ({ ...prev, [file.name]: 20 }));

            const imgData = reader.result as string;
            const imgName = removeExtension(file.name);

            const response = await fetch(imgData);
            const blob = await response.blob();

            // 延迟导入 heic2any
            let heic2anyModule;
            try {
              // 动态导入
              const importedModule = await import("heic2any");
              heic2anyModule = importedModule.default;

              // 更新进度到40%
              setProgress((prev) => ({ ...prev, [file.name]: 40 }));
            } catch (importErr) {
              console.error("导入 heic2any 失败:", importErr);
              reject("加载转换模块失败");
              return;
            }

            // 使用heic2any进行转换
            let conversionResult;
            try {
              conversionResult = await heic2anyModule({
                blob,
                toType: "image/jpeg",
                quality: 0.5,
              });

              // 更新进度到60%
              setProgress((prev) => ({ ...prev, [file.name]: 60 }));
            } catch (convErr) {
              console.error("HEIC转换错误:", convErr);
              reject("HEIC转换失败");
              return;
            }

            let jpegBlob = conversionResult as Blob;

            // 应用图片配置
            try {
              jpegBlob = await applyImageConfig(jpegBlob);
              // 更新进度到70%
              setProgress((prev) => ({ ...prev, [file.name]: 70 }));
            } catch (configErr) {
              console.error("应用图片配置错误:", configErr);
              // 继续处理，但使用原始blob
            }

            if (fileOutputType === "jpeg") {
              // 下载JPEG文件
              const url = URL.createObjectURL(jpegBlob);
              downloadURI(url, imgName + ".jpeg");
              URL.revokeObjectURL(url);

              // 完成
              setProgress((prev) => ({ ...prev, [file.name]: 100 }));
              resolve(null);
            } else {
              if (pdfMode === "separate") {
                // 单独处理为PDF
                await createAndSavePdf([
                  { blob: jpegBlob, name: imgName, outputType: "pdf" },
                ]);
                // 完成
                setProgress((prev) => ({ ...prev, [file.name]: 100 }));
                resolve(null);
              } else {
                // 返回处理后的JPEG Blob用于后续合并
                setProgress((prev) => ({ ...prev, [file.name]: 90 }));
                resolve({ blob: jpegBlob, name: imgName, outputType: "pdf" });
              }
            }
          } catch (err) {
            console.error("转换错误:", err);
            reject("转换失败，请重试");
          }
        };

        reader.onerror = () => {
          reject("读取文件失败");
        };

        reader.readAsDataURL(file);
      });
    } catch (err) {
      console.error("处理错误:", err);
      throw new Error(err instanceof Error ? err.message : "处理文件时出错");
    }
  };

  // 创建并保存PDF
  const createAndSavePdf = async (
    images: { blob: Blob; name: string; outputType: "jpeg" | "pdf" }[]
  ): Promise<void> => {
    if (images.length === 0) return;

    try {
      // 延迟导入 jsPDF
      let jsPDFModule;
      try {
        const jspdfImport = await import("jspdf");
        jsPDFModule = jspdfImport.jsPDF;
      } catch (jspdfErr) {
        console.error("导入 jsPDF 失败:", jspdfErr);
        throw new Error("加载PDF生成模块失败");
      }

      // 创建一个PDF文档用于所有图片
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let doc: any = null; // 初始化doc变量

      // 处理每个图片
      for (let i = 0; i < images.length; i++) {
        const { blob } = images[i]; // 移除未使用的name解构赋值

        // 创建URL
        const url = URL.createObjectURL(blob);

        try {
          // 加载图片
          const imgResult = await new Promise<HTMLImageElement>(
            (resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error("图像加载失败"));
              img.src = url;
            }
          );

          // 如果是第一张图片，创建PDF文档
          if (i === 0) {
            if (imageConfig.pdfPageSize === "image") {
              // 使用图片实际尺寸（将px转换为mm，1px ≈ 0.264583mm）
              const pxToMm = 0.264583;
              const width = imgResult.width * pxToMm;
              const height = imgResult.height * pxToMm;

              // 创建指定尺寸的PDF
              doc = new jsPDFModule({
                orientation: width > height ? "landscape" : "portrait",
                unit: "mm",
                format: [width, height],
              });

              // 在整个页面上绘制图片
              doc.addImage(url, "JPEG", 0, 0, width, height);
            } else {
              // 使用标准页面尺寸
              const format = imageConfig.pdfPageSize === "a4" ? "a4" : "letter";
              doc = new jsPDFModule({
                format: format,
              });

              // 获取页面尺寸
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();

              // 计算图片纵横比
              const imgRatio = imgResult.width / imgResult.height;
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

              // 添加图片到PDF
              doc.addImage(url, "JPEG", x, y, imgWidth, imgHeight);
            }
          }
          // 如果是后续图片且是合并模式，添加新页面
          else if (doc && pdfMode === "merge") {
            // 添加新页面
            if (imageConfig.pdfPageSize === "image") {
              // 对于图片尺寸模式，我们需要为每个图片调整页面大小
              const pxToMm = 0.264583;
              const width = imgResult.width * pxToMm;
              const height = imgResult.height * pxToMm;

              // 添加新页面时指定大小
              doc.addPage(
                [width, height],
                width > height ? "landscape" : "portrait"
              );

              // 在整个页面上绘制图片
              doc.addImage(url, "JPEG", 0, 0, width, height);
            } else {
              // 标准尺寸模式下
              // 添加新页面（使用与第一页相同的大小）
              doc.addPage();

              // 获取页面尺寸
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();

              // 计算图片纵横比
              const imgRatio = imgResult.width / imgResult.height;
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

              // 添加图片到PDF
              doc.addImage(url, "JPEG", x, y, imgWidth, imgHeight);
            }
          }
          // 如果是单独模式，为每个图片创建一个新的PDF
          else if (pdfMode === "separate") {
            // 对于单独模式，每个图片都会单独处理为一个PDF，这部分逻辑在convertSingleFile中处理
            // 这里不应该执行到，仅作为防御性编程
            console.warn("在合并处理中遇到单独模式图片，这不应该发生");
          }
        } finally {
          // 释放URL
          URL.revokeObjectURL(url);
        }
      }

      // 所有图片处理完毕后保存PDF
      if (doc) {
        const fileName =
          images.length === 1
            ? `${images[0].name}.pdf`
            : `合并文档_${new Date().getTime()}.pdf`;

        doc.save(fileName);
      } else {
        throw new Error("PDF文档创建失败");
      }
    } catch (err) {
      console.error("PDF生成错误:", err);
      throw new Error("PDF生成失败");
    }
  };

  // 转换所有文件
  const convertFiles = async () => {
    if (files.length === 0) return;

    setConverting(true);
    setError(null);

    try {
      // 分类文件
      const jpegFiles: File[] = [];
      const pdfSeparateFiles: File[] = [];
      const pdfMergeFiles: File[] = [];

      // 根据每个文件的输出类型和PDF模式进行分类
      files.forEach((file) => {
        const outputType = getFileOutputType(file.name);
        if (outputType === "jpeg") {
          jpegFiles.push(file);
        } else if (outputType === "pdf") {
          if (pdfMode === "separate") {
            pdfSeparateFiles.push(file);
          } else {
            pdfMergeFiles.push(file);
          }
        }
      });

      // 批量处理 JPEG 文件
      if (jpegFiles.length > 0) {
        const batchSize = 3;
        for (let i = 0; i < jpegFiles.length; i += batchSize) {
          const batch = jpegFiles.slice(i, i + batchSize);
          await Promise.allSettled(
            batch.map((file) => convertSingleFile(file))
          );
        }
      }

      // 批量处理单独 PDF 文件
      if (pdfSeparateFiles.length > 0) {
        const batchSize = 3;
        for (let i = 0; i < pdfSeparateFiles.length; i += batchSize) {
          const batch = pdfSeparateFiles.slice(i, i + batchSize);
          await Promise.allSettled(
            batch.map((file) => convertSingleFile(file))
          );
        }
      }

      // 处理需要合并的 PDF 文件
      if (pdfMergeFiles.length > 0) {
        const results: {
          blob: Blob;
          name: string;
          outputType: "jpeg" | "pdf";
        }[] = [];

        // 更新所有合并PDF文件的进度
        pdfMergeFiles.forEach((file) => {
          setProgress((prev) => ({ ...prev, [file.name]: 1 }));
        });

        // 转换所有合并PDF文件
        for (const file of pdfMergeFiles) {
          try {
            const result = await convertSingleFile(file);
            if (result) {
              results.push(result);
            }
          } catch (err) {
            console.error(`处理 ${file.name} 失败:`, err);
            setError(`部分文件处理失败`);
          }
        }

        // 如果有成功转换的文件，合并为一个PDF
        if (results.length > 0) {
          await createAndSavePdf(results);

          // 设置所有合并PDF文件为100%完成
          pdfMergeFiles.forEach((file) => {
            setProgress((prev) => ({ ...prev, [file.name]: 100 }));
          });
        }
      }
    } catch (err) {
      console.error("批量转换错误:", err);
      setError(err instanceof Error ? err.message : "批量转换时出错");
    } finally {
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/heic": [".heic"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true, // 允许多选
  });

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
    setFileOutputs((prev) =>
      prev.filter((config) => config.fileId !== fileToRemove.name)
    );
  };

  const removeAllFiles = () => {
    setFiles([]);
    setProgress({});
    setFileOutputs([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 配置面板组件
  const ConfigPanel = () => (
    <div
      className={`${
        showConfigPanel ? "block" : "hidden"
      } rounded-lg p-4 mb-4 bg-white`}
    >
      {/* <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">图片配置选项</h3>
        <button
          onClick={toggleConfigPanel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF页面大小设置 - 最高优先级 */}
        {outputType === "pdf" && (
          <div className="md:col-span-2 border-b border-gray-300 pb-4 mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF页面大小
            </label>
            <select
              value={imageConfig.pdfPageSize}
              onChange={(e) =>
                handleImageConfigChange("pdfPageSize", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="image">使用图片实际尺寸</option>
              <option value="a4">A4标准尺寸</option>
              <option value="letter">Letter标准尺寸</option>
            </select>
            <p className="mt-1 text-sm text-gray-400">
              {imageConfig.pdfPageSize === "image" &&
                "PDF页面大小与图片实际尺寸相同，无白边，更好地展示图片原貌"}
              {imageConfig.pdfPageSize === "a4" &&
                "使用A4标准尺寸（210×297毫米），适合打印"}
              {imageConfig.pdfPageSize === "letter" &&
                "使用Letter标准尺寸（216×279毫米），适合北美地区打印"}
            </p>
          </div>
        )}

        {/* 元数据处理 - 第二优先级 */}
        <div className="md:col-span-2 border-b border-gray-300 pb-4 mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            元数据处理
          </label>
          <div className="flex items-center space-x-4 mb-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={imageConfig.stripMetadata}
                onChange={() => handleImageConfigChange("stripMetadata", true)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">移除元数据</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={!imageConfig.stripMetadata}
                onChange={() => handleImageConfigChange("stripMetadata", false)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">保留元数据</span>
            </label>
          </div>
          <p className="text-sm text-gray-400">
            元数据包含拍摄设备、时间、GPS位置等信息。移除元数据可以保护隐私并减小文件大小，
            但会丢失照片的历史记录和设置信息。对于含有敏感位置信息的照片，建议选择&quot;移除元数据&quot;。
          </p>
        </div>

        {/* 宽度和高度 - 较低优先级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            宽度
          </label>
          <input
            type="number"
            value={imageConfig.width}
            onChange={(e) => handleImageConfigChange("width", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输出宽度(像素)"
          />
          <p className="mt-1 text-xs text-gray-400">
            输出宽度（像素），留空表示保持原始宽度
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            高度
          </label>
          <input
            type="number"
            value={imageConfig.height}
            onChange={(e) => handleImageConfigChange("height", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输出高度(像素)"
          />
          <p className="mt-1 text-xs text-gray-400">
            输出高度（像素），留空表示保持原始高度
          </p>
        </div>

        {/* 适应方式 - 最低优先级，仅当设置了宽度或高度时有效 */}
        {(imageConfig.width || imageConfig.height) && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              适应方式
            </label>
            <select
              value={imageConfig.fit}
              onChange={(e) => handleImageConfigChange("fit", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="max">最大适应（Max）</option>
              <option value="crop">裁剪（Crop）</option>
              <option value="scale">强制缩放（Scale）</option>
            </select>
            <p className="mt-1 text-sm text-gray-400">
              {imageConfig.fit === "max" &&
                "不超过指定尺寸，但不放大小图片（保持原始比例）"}
              {imageConfig.fit === "crop" &&
                "填充指定尺寸，并裁剪多余部分（可能丢失图片边缘内容）"}
              {imageConfig.fit === "scale" &&
                "强制拉伸或压缩到指定尺寸（可能导致图片变形）"}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // 返回组件UI
  return (
    <article className="max-w-4xl mx-auto py-8">
      {files.length === 0 ? (
        // 无文件状态 - 简洁中心布局
        <div className="flex flex-col items-center justify-center">
          <div
            className="flex justify-center items-center w-full"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <div
              className="border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
              {...getRootProps()}
              style={{ width: "730px", height: "280px" }}
            >
              <input
                {...getInputProps()}
                ref={fileInputRef}
                aria-label="选择HEIC文件"
              />

              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-4 px-8 rounded-lg flex items-center text-lg font-medium mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                选择文件
              </button>
              <p className="text-gray-500 mb-4 text-lg">或拖放HEIC文件到此处</p>
              <p className="text-sm text-gray-500">
                支持HEIC格式 • 支持批量上传 • 不限文件大小
              </p>
            </div>
          </div>

          {error && (
            <div
              className="mt-6 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 flex items-start max-w-lg"
              role="alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 001 1h1a1 1 0 100-2h-1a1 1 0 00-1 1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        // 有文件状态 - 文件列表视图
        <div>
          {/* 头部控制区 - 重新设计，整合顶部和底部功能 */}
          <div className="bg-gray-100 rounded-t-lg p-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 py-2 px-4 rounded flex items-center transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                继续上传文件
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      onDrop(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  accept=".heic"
                  multiple
                />
              </button>

              <button
                onClick={removeAllFiles}
                className="ml-3 bg-red-50 text-red-500 hover:bg-red-100 py-2 px-4 rounded flex items-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                清空列表
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {hasPdfMergeOption && (
                <div className="flex items-center mr-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                      checked={pdfMode === "merge"}
                      onChange={handlePdfMergeCheckbox}
                    />
                    <span className="ml-2 text-gray-700">合并PDF文件</span>
                  </label>
                </div>
              )}

              <button
                onClick={() => setShowConfigPanel(true)}
                className="text-gray-500 hover:text-gray-700 p-1"
                aria-label="设置选项"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                onClick={convertFiles}
                disabled={files.length === 0 || converting}
                className={`px-6 py-2 rounded-lg flex items-center font-medium text-white transition-colors
                  ${
                    files.length === 0 || converting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
              >
                {converting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    转换中
                  </>
                ) : (
                  <>
                    转换
                    <svg
                      className="ml-2 -mr-1 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 文件列表 - 调整为倒序显示 */}
          <div className="border border-gray-200 border-t-0 rounded-b-lg overflow-hidden bg-white">
            {[...files].reverse().map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-200 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-indigo-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* 显示处理进度 */}
                  {progress[file.name] > 0 && progress[file.name] < 100 && (
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${progress[file.name]}%` }}
                        role="progressbar"
                        aria-valuenow={progress[file.name]}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  )}

                  {progress[file.name] === 100 && (
                    <span className="text-green-500 flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      完成
                    </span>
                  )}

                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">输出:</span>
                    <div className="relative">
                      <select
                        className="bg-white border border-gray-300 text-gray-700 py-1 pl-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={getFileOutputType(file.name)}
                        onChange={(e) =>
                          handleFileOutputChange(
                            file.name,
                            e.target.value as "jpeg" | "pdf"
                          )
                        }
                        disabled={converting}
                      >
                        <option value="pdf">PDF</option>
                        <option value="jpeg">JPEG</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(file)}
                    disabled={converting}
                    className={`text-gray-500 hover:text-red-600 p-1 ${
                      converting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label={`移除文件 ${file.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 高级配置弹窗 - 改为弹窗形式 */}
          {showConfigPanel && (
            <div className="fixed inset-0 bg-black bg-opacity-45 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-xl w-full max-h-[90vh] flex flex-col animate-fade-in">
                <div className="p-4 bg-white flex justify-between items-center">
                  <h3 className="text-lg font-medium">高级配置选项</h3>
                  <button
                    onClick={() => setShowConfigPanel(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto">
                  <ConfigPanel />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div
              className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 flex items-start"
              role="alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 001 1h1a1 1 0 100-2h-1a1 1 0 00-1 1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* 结构化数据 - 有助于SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "HEIC转PDF在线转换工具",
            description:
              "免费将HEIC照片转换为PDF或JPEG格式，支持批量处理，无需安装软件",
            operatingSystem: "All",
            applicationCategory: "UtilitiesApplication",
            offers: {
              "@type": "Offer",
              price: "0",
            },
          }),
        }}
      />
    </article>
  );
}
