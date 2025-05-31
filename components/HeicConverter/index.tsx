"use client";

import React from "react";
import { useHeicConverter } from "./useHeicConverter";
import DropZone from "./DropZone";
import FileList from "./FileList";
import ConfigPanel from "./ConfigPanel";
import HeaderControls from "./HeaderControls";

export default function HeicConverter() {
  console.log(
    "env ==> ",
    process.env.NODE_ENV,
    process.env.NODE_ENV === "production"
  );

  const {
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
  } = useHeicConverter();

  return (
    <article className="max-w-4xl mx-auto py-8">
      {files.length === 0 ? (
        <DropZone onDrop={onDrop} fileInputRef={fileInputRef} error={error} />
      ) : (
        <div>
          {/* 头部控制区 */}
          <HeaderControls
            fileInputRef={fileInputRef}
            onDrop={onDrop}
            removeAllFiles={removeAllFiles}
            hasPdfMergeOption={hasPdfMergeOption}
            pdfMode={pdfMode}
            handlePdfMergeCheckbox={handlePdfMergeCheckbox}
            setShowConfigPanel={setShowConfigPanel}
            convertFiles={convertFiles}
            converting={converting}
            files={files}
          />
          {/* 文件列表 */}
          <FileList
            files={files}
            progress={progress}
            getFileOutputType={getFileOutputType}
            handleFileOutputChange={handleFileOutputChange}
            removeFile={removeFile}
            converting={converting}
          />
          {/* 高级配置弹窗 */}
          <ConfigPanel
            imageConfig={imageConfig}
            handleImageConfigChange={handleImageConfigChange}
            outputType={outputType}
            show={showConfigPanel}
            onClose={() => setShowConfigPanel(false)}
          />
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
                aria-hidden="true"
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
            name: "HEIC to PDF Online Conversion Tool",
            description:
              "Free HEIC photos to PDF or JPEG format conversion, supports batch processing, no software installation required",
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
