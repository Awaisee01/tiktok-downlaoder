import React from "react";

const Instructions: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" id="about">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">How to Download TikTok Videos</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-[#FF0050]/10 rounded-full p-2">
            <span className="material-icons text-[#FF0050]">content_copy</span>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">Copy the video link</h3>
            <p className="mt-1 text-sm text-gray-500">
              Open TikTok app, tap "Share" and then "Copy Link" on the video you want to download
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-[#FF0050]/10 rounded-full p-2">
            <span className="material-icons text-[#FF0050]">paste</span>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">Paste the URL</h3>
            <p className="mt-1 text-sm text-gray-500">
              Paste the copied link into the input field above
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-[#FF0050]/10 rounded-full p-2">
            <span className="material-icons text-[#FF0050]">settings</span>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">Choose options</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select whether you want to download with or without the TikTok watermark
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-[#FF0050]/10 rounded-full p-2">
            <span className="material-icons text-[#FF0050]">download</span>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">Download</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click the download button and save the video to your device
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
