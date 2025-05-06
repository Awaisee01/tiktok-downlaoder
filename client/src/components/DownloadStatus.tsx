import React from "react";
import { Button } from "@/components/ui/button";

type DownloadStateProps = {
  state: {
    state: "idle" | "loading" | "success" | "error";
    url?: string;
    error?: string;
  };
};

const DownloadStatus: React.FC<DownloadStateProps> = ({ state }) => {
  if (state.state === "idle") {
    return null;
  }

  return (
    <div className="mt-6">
      {/* Loading State */}
      {state.state === "loading" && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF0050]"></div>
          <p className="mt-2 text-gray-600">Fetching video... Please wait</p>
        </div>
      )}

      {/* Success State */}
      {state.state === "success" && state.url && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-[hsl(var(--success))]">check_circle</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Download Ready!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your video has been processed successfully.</p>
              </div>
              <div className="mt-4">
                <a
                  href={state.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[hsl(var(--success))] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  download
                >
                  <span className="material-icons mr-1">save_alt</span>
                  Save Video
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {state.state === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-[hsl(var(--error))]">error</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Download Failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{state.error || "Unable to process this video. Please check the URL and try again."}</p>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadStatus;
