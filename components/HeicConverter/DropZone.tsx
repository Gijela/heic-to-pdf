import React from "react";
import { useDropzone } from "react-dropzone";

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  error: string | null;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, fileInputRef, error }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/heic": [".heic"] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="flex justify-center items-center w-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <div
          className="border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
          {...getRootProps()}
          style={{ width: "730px", height: "280px" }}
        >
          <input
            {...getInputProps()}
            ref={fileInputRef}
            aria-label="Select HEIC files for HEIC to PDF conversion"
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
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload Files
          </button>
          <p className="text-gray-500 mb-4 text-lg">
            or drag and drop HEIC files here
          </p>
          <p className="text-sm text-gray-500">
            Supports HEIC format • Batch upload • No file size limit • Local
            conversion for privacy
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
  );
};

export default DropZone;
