import React from "react";

interface FileListProps {
  files: File[];
  progress: { [key: string]: number };
  getFileOutputType: (fileId: string) => "jpeg" | "pdf";
  handleFileOutputChange: (
    fileId: string,
    newOutputType: "jpeg" | "pdf"
  ) => void;
  removeFile: (file: File) => void;
  converting: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  progress,
  getFileOutputType,
  handleFileOutputChange,
  removeFile,
  converting,
}) => {
  return (
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
              aria-hidden="true"
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
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Completed
              </span>
            )}
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Output:</span>
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
                  aria-label="Select output format"
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
                    aria-hidden="true"
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
              aria-label={`Remove file ${file.name}`}
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
        </div>
      ))}
    </div>
  );
};

export default FileList;
