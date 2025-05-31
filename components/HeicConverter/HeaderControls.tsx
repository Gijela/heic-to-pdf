import React from "react";

interface HeaderControlsProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDrop: (files: File[]) => void;
  removeAllFiles: () => void;
  hasPdfMergeOption: boolean;
  pdfMode: "separate" | "merge";
  handlePdfMergeCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowConfigPanel: (show: boolean) => void;
  convertFiles: () => void;
  converting: boolean;
  files: File[];
}

const HeaderControls: React.FC<HeaderControlsProps> = ({
  fileInputRef,
  onDrop,
  removeAllFiles,
  hasPdfMergeOption,
  pdfMode,
  handlePdfMergeCheckbox,
  setShowConfigPanel,
  convertFiles,
  converting,
  files,
}) => {
  return (
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
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Continue Upload Files
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
            aria-label="Select more HEIC files"
          />
        </button>
        <button
          onClick={removeAllFiles}
          className="ml-3 bg-red-50 text-red-500 hover:bg-red-100 py-2 px-4 rounded flex items-center transition-colors"
          aria-label="Clear file list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear List
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
                aria-label="Merge PDF files"
              />
              <span className="ml-2 text-gray-700">Merge PDF files</span>
            </label>
          </div>
        )}
        <button
          onClick={() => setShowConfigPanel(true)}
          className="text-gray-500 hover:text-gray-700 p-1"
          aria-label="Set advanced options"
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
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={convertFiles}
          disabled={files.length === 0 || converting}
          className={`px-6 py-2 rounded-lg flex items-center font-medium text-white transition-colors ${
            files.length === 0 || converting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
          aria-label="Start converting HEIC files"
        >
          {converting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
                />
              </svg>
              Converting
            </>
          ) : (
            <>
              Convert
              <svg
                className="ml-2 -mr-1 w-5 h-5"
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HeaderControls;
