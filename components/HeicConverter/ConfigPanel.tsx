import React from "react";
import type { ImageConfig } from "./useHeicConverter";

interface ConfigPanelProps {
  imageConfig: ImageConfig;
  handleImageConfigChange: (
    field: keyof ImageConfig,
    value: string | boolean
  ) => void;
  outputType: "jpeg" | "pdf";
  show: boolean;
  onClose: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  imageConfig,
  handleImageConfigChange,
  outputType,
  show,
  onClose,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-45 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-xl w-full max-h-[90vh] flex flex-col animate-fade-in">
        <div className="p-4 bg-white flex justify-between items-center">
          <h3 className="text-lg font-medium">
            PDF Conversion Advanced Options
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close configuration panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          {/* PDF页面大小设置 */}
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
          {/* 元数据处理 */}
          <div className="md:col-span-2 border-b border-gray-300 pb-4 mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              元数据处理
            </label>
            <div className="flex items-center space-x-4 mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={imageConfig.stripMetadata}
                  onChange={() =>
                    handleImageConfigChange("stripMetadata", true)
                  }
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">移除元数据</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={!imageConfig.stripMetadata}
                  onChange={() =>
                    handleImageConfigChange("stripMetadata", false)
                  }
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">保留元数据</span>
              </label>
            </div>
            <p className="text-sm text-gray-400">
              元数据包含拍摄设备、时间、GPS位置等信息。移除元数据可以保护隐私并减小文件大小，
              但会丢失照片的历史记录和设置信息。对于含有敏感位置信息的照片，建议选择"移除元数据"。
            </p>
          </div>
          {/* 宽度和高度 */}
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
              onChange={(e) =>
                handleImageConfigChange("height", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输出高度(像素)"
            />
            <p className="mt-1 text-xs text-gray-400">
              输出高度（像素），留空表示保持原始高度
            </p>
          </div>
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
    </div>
  );
};

export default ConfigPanel;
