import { useState, useCallback, useRef, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { removeExtension, downloadURI } from "./utils";

// 定义图片处理配置类型
export type ImageConfig = {
  width: string;
  height: string;
  fit: "max" | "crop" | "scale";
  stripMetadata: boolean;
  pdfPageSize: "image" | "a4" | "letter";
};

export interface FileOutputConfig {
  fileId: string;
  outputType: "jpeg" | "pdf";
}

export function useHeicConverter() {
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
    pdfPageSize: "image",
  });
  const [fileOutputs, setFileOutputs] = useState<FileOutputConfig[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 文件上传
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
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
        setFiles((prevFiles) => [...validFiles, ...prevFiles]);
        const newOutputConfigs = validFiles.map((file) => ({
          fileId: file.name,
          outputType: outputType,
        }));
        setFileOutputs((prevOutputs) => [...newOutputConfigs, ...prevOutputs]);
      }
    },
    [outputType]
  );

  // 单文件输出格式
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

  // 是否显示合并PDF选项
  const hasPdfMergeOption = useMemo(() => {
    const pdfCount = fileOutputs.filter((config) => config.outputType === "pdf").length;
    return pdfCount >= 2;
  }, [fileOutputs]);

  // 获取文件输出格式
  const getFileOutputType = (fileId: string): "jpeg" | "pdf" => {
    const fileConfig = fileOutputs.find((config) => config.fileId === fileId);
    return fileConfig?.outputType || outputType;
  };

  // PDF合并模式
  const handlePdfMergeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfMode(e.target.checked ? "merge" : "separate");
  };

  // 图片配置变更
  const handleImageConfigChange = (
    field: keyof ImageConfig,
    value: string | boolean
  ) => {
    setImageConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 移除单个文件
  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
    setFileOutputs((prev) => prev.filter((config) => config.fileId !== fileToRemove.name));
  };

  // 移除全部文件
  const removeAllFiles = () => {
    setFiles([]);
    setProgress({});
    setFileOutputs([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 应用图片配置
  const applyImageConfig = async (blob: Blob): Promise<Blob> => {
    if (!imageConfig.width && !imageConfig.height && !imageConfig.stripMetadata) {
      return blob;
    }
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("无法创建Canvas上下文");
      const img = await createImageBitmap(blob);
      let targetWidth = img.width;
      let targetHeight = img.height;
      const configWidth = imageConfig.width ? parseInt(imageConfig.width) : 0;
      const configHeight = imageConfig.height ? parseInt(imageConfig.height) : 0;
      if (configWidth > 0 || configHeight > 0) {
        if (imageConfig.fit === "max") {
          if (configWidth > 0 && configHeight > 0) {
            const scaleWidth = configWidth / img.width;
            const scaleHeight = configHeight / img.height;
            const scale = Math.min(scaleWidth, scaleHeight, 1);
            targetWidth = Math.floor(img.width * scale);
            targetHeight = Math.floor(img.height * scale);
          } else if (configWidth > 0) {
            const scale = Math.min(configWidth / img.width, 1);
            targetWidth = Math.floor(img.width * scale);
            targetHeight = Math.floor(img.height * scale);
          } else if (configHeight > 0) {
            const scale = Math.min(configHeight / img.height, 1);
            targetWidth = Math.floor(img.width * scale);
            targetHeight = Math.floor(img.height * scale);
          }
        } else if (imageConfig.fit === "crop") {
          targetWidth = configWidth > 0 ? configWidth : img.width;
          targetHeight = configHeight > 0 ? configHeight : img.height;
        } else if (imageConfig.fit === "scale") {
          targetWidth = configWidth > 0 ? configWidth : img.width;
          targetHeight = configHeight > 0 ? configHeight : img.height;
        }
      }
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (imageConfig.fit === "crop" && (configWidth > 0 || configHeight > 0)) {
        const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (targetWidth - scaledWidth) / 2;
        const offsetY = (targetHeight - scaledHeight) / 2;
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      } else {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }
      const quality = 0.92;
      const mimeType = "image/jpeg";
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (newBlob) => {
            if (newBlob) resolve(newBlob);
            else reject(new Error("Canvas转换失败"));
          },
          mimeType,
          quality
        );
      });
    } catch (err) {
      console.error("应用图片配置错误:", err);
      return blob;
    }
  };

  // 单文件转换
  const convertSingleFile = async (
    file: File
  ): Promise<{
    blob: Blob;
    name: string;
    outputType: "jpeg" | "pdf";
  } | null> => {
    try {
      setProgress((prev) => ({ ...prev, [file.name]: 1 }));
      const fileOutputType = getFileOutputType(file.name);
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            if (!reader.result) throw new Error("读取文件失败");
            setProgress((prev) => ({ ...prev, [file.name]: 20 }));
            const imgData = reader.result as string;
            const imgName = removeExtension(file.name);
            const response = await fetch(imgData);
            const blob = await response.blob();
            let heic2anyModule;
            try {
              const importedModule = await import("heic2any");
              heic2anyModule = importedModule.default;
              setProgress((prev) => ({ ...prev, [file.name]: 40 }));
            } catch (importErr) {
              console.error("导入 heic2any 失败:", importErr);
              reject("加载转换模块失败");
              return;
            }
            let conversionResult;
            try {
              conversionResult = await heic2anyModule({
                blob,
                toType: "image/jpeg",
                quality: 0.5,
              });
              setProgress((prev) => ({ ...prev, [file.name]: 60 }));
            } catch (convErr) {
              console.error("HEIC转换错误:", convErr);
              reject("HEIC转换失败");
              return;
            }
            let jpegBlob = conversionResult as Blob;
            try {
              jpegBlob = await applyImageConfig(jpegBlob);
              setProgress((prev) => ({ ...prev, [file.name]: 70 }));
            } catch (configErr) {
              console.error("应用图片配置错误:", configErr);
            }
            if (fileOutputType === "jpeg") {
              const url = URL.createObjectURL(jpegBlob);
              downloadURI(url, imgName + ".jpeg");
              URL.revokeObjectURL(url);
              setProgress((prev) => ({ ...prev, [file.name]: 100 }));
              resolve(null);
            } else {
              if (pdfMode === "separate") {
                await createAndSavePdf([
                  { blob: jpegBlob, name: imgName, outputType: "pdf" },
                ]);
                setProgress((prev) => ({ ...prev, [file.name]: 100 }));
                resolve(null);
              } else {
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

  // PDF生成
  const createAndSavePdf = async (
    images: { blob: Blob; name: string; outputType: "jpeg" | "pdf" }[]
  ): Promise<void> => {
    if (images.length === 0) return;
    try {
      let jsPDFModule;
      try {
        const jspdfImport = await import("jspdf");
        jsPDFModule = jspdfImport.jsPDF;
      } catch (jspdfErr) {
        console.error("导入 jsPDF 失败:", jspdfErr);
        throw new Error("加载PDF生成模块失败");
      }
      let doc: any = null;
      for (let i = 0; i < images.length; i++) {
        const { blob } = images[i];
        const url = URL.createObjectURL(blob);
        try {
          const imgResult = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("图像加载失败"));
            img.src = url;
          });
          if (i === 0) {
            if (imageConfig.pdfPageSize === "image") {
              const pxToMm = 0.264583;
              const width = imgResult.width * pxToMm;
              const height = imgResult.height * pxToMm;
              doc = new jsPDFModule({
                orientation: width > height ? "landscape" : "portrait",
                unit: "mm",
                format: [width, height],
              });
              doc.addImage(url, "JPEG", 0, 0, width, height);
            } else {
              const format = imageConfig.pdfPageSize === "a4" ? "a4" : "letter";
              doc = new jsPDFModule({ format });
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();
              const imgRatio = imgResult.width / imgResult.height;
              const pageRatio = pageWidth / pageHeight;
              let imgWidth, imgHeight;
              let x = 0, y = 0;
              if (imgRatio > pageRatio) {
                imgWidth = pageWidth;
                imgHeight = imgWidth / imgRatio;
                y = (pageHeight - imgHeight) / 2;
              } else {
                imgHeight = pageHeight;
                imgWidth = imgHeight * imgRatio;
                x = (pageWidth - imgWidth) / 2;
              }
              doc.addImage(url, "JPEG", x, y, imgWidth, imgHeight);
            }
          } else if (doc && pdfMode === "merge") {
            if (imageConfig.pdfPageSize === "image") {
              const pxToMm = 0.264583;
              const width = imgResult.width * pxToMm;
              const height = imgResult.height * pxToMm;
              doc.addPage([width, height], width > height ? "landscape" : "portrait");
              doc.addImage(url, "JPEG", 0, 0, width, height);
            } else {
              doc.addPage();
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();
              const imgRatio = imgResult.width / imgResult.height;
              const pageRatio = pageWidth / pageHeight;
              let imgWidth, imgHeight;
              let x = 0, y = 0;
              if (imgRatio > pageRatio) {
                imgWidth = pageWidth;
                imgHeight = imgWidth / imgRatio;
                y = (pageHeight - imgHeight) / 2;
              } else {
                imgHeight = pageHeight;
                imgWidth = imgHeight * imgRatio;
                x = (pageWidth - imgWidth) / 2;
              }
              doc.addImage(url, "JPEG", x, y, imgWidth, imgHeight);
            }
          }
        } finally {
          URL.revokeObjectURL(url);
        }
      }
      if (doc) {
        const fileName = images.length === 1 ? `${images[0].name}.pdf` : `merged_${new Date().getTime()}.pdf`;
        doc.save(fileName);
      } else {
        throw new Error("PDF文档创建失败");
      }
    } catch (err) {
      console.error("PDF生成错误:", err);
      throw new Error("PDF生成失败");
    }
  };

  // 批量转换
  const convertFiles = async () => {
    if (files.length === 0) return;
    setConverting(true);
    setError(null);
    try {
      const jpegFiles: File[] = [];
      const pdfSeparateFiles: File[] = [];
      const pdfMergeFiles: File[] = [];
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
      if (jpegFiles.length > 0) {
        const batchSize = 3;
        for (let i = 0; i < jpegFiles.length; i += batchSize) {
          const batch = jpegFiles.slice(i, i + batchSize);
          await Promise.allSettled(batch.map((file) => convertSingleFile(file)));
        }
      }
      if (pdfSeparateFiles.length > 0) {
        const batchSize = 3;
        for (let i = 0; i < pdfSeparateFiles.length; i += batchSize) {
          const batch = pdfSeparateFiles.slice(i, i + batchSize);
          await Promise.allSettled(batch.map((file) => convertSingleFile(file)));
        }
      }
      if (pdfMergeFiles.length > 0) {
        const results: { blob: Blob; name: string; outputType: "jpeg" | "pdf" }[] = [];
        pdfMergeFiles.forEach((file) => {
          setProgress((prev) => ({ ...prev, [file.name]: 1 }));
        });
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
        if (results.length > 0) {
          await createAndSavePdf(results);
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

  return {
    files,
    setFiles,
    converting,
    outputType,
    setOutputType,
    pdfMode,
    setPdfMode,
    error,
    setError,
    progress,
    showConfigPanel,
    setShowConfigPanel,
    imageConfig,
    setImageConfig,
    fileOutputs,
    setFileOutputs,
    fileInputRef,
    onDrop,
    handleFileOutputChange,
    hasPdfMergeOption,
    getFileOutputType,
    handlePdfMergeCheckbox,
    handleImageConfigChange,
    removeFile,
    removeAllFiles,
    convertFiles,
  };
} 