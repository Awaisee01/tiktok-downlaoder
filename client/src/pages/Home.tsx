import React from "react";
import DownloadForm from "@/components/DownloadForm";
import Instructions from "@/components/Instructions";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[hsl(var(--dark))] text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-[#FF0050] text-3xl">video_library</span>
            <h1 className="text-xl md:text-2xl font-bold">TikTok Downloader</h1>
          </div>
          <div className="flex items-center">
            <a href="#about" className="text-gray-300 hover:text-white transition duration-150">
              <span className="material-icons">help_outline</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <DownloadForm />
          <Instructions />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[hsl(var(--dark))] text-white py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                This tool is for personal use only. Please respect copyright and terms of service.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="material-icons">help</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="material-icons">policy</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
