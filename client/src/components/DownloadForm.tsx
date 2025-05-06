import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import DownloadStatus from "@/components/DownloadStatus";

type DownloadState = {
  state: "idle" | "loading" | "success" | "error";
  url?: string;
  error?: string;
};

const DownloadForm: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [watermark, setWatermark] = useState<boolean>(false);
  const [downloadState, setDownloadState] = useState<DownloadState>({ state: "idle" });
  const { toast } = useToast();

  const handleClear = () => {
    setUrl("");
  };

  const isValidTikTokUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.|vm\.|vt\.)?tiktok\.com\/.+/i;
    return regex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a TikTok video URL",
        variant: "destructive",
      });
      return;
    }

    if (!isValidTikTokUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid TikTok video URL",
        variant: "destructive",
      });
      return;
    }

    setDownloadState({ state: "loading" });

    try {
      const response = await apiRequest("POST", "/api/download", {
        url,
        watermark,
      });

      const data = await response.json();

      if (data.success && data.type === "video") {
        setDownloadState({
          state: "success",
          url: data.url,
        });
      } else {
        setDownloadState({
          state: "error",
          error: data.message || "Failed to process the video",
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      setDownloadState({
        state: "error",
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      {/* Card Header */}
      <div className="gradient-header px-6 py-4">
        <h2 className="text-white text-xl font-semibold flex items-center">
          <span className="material-icons mr-2">download</span>
          Download TikTok Video
        </h2>
      </div>

      {/* Card Body */}
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div>
            <Label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
              TikTok Video URL
            </Label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-gray-400">link</span>
              </div>
              <Input
                type="url"
                id="videoUrl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                placeholder="https://www.tiktok.com/@username/video/1234567890123456789"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="material-icons">clear</span>
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Paste the TikTok video URL from the app or browser
            </p>
          </div>

          {/* Watermark Option */}
          <RadioGroup
            defaultValue={watermark ? "with" : "without"}
            onValueChange={(value) => setWatermark(value === "with")}
            className="flex items-center space-x-2"
          >
            <div className="flex items-center">
              <RadioGroupItem value="without" id="withoutWatermark" />
              <Label htmlFor="withoutWatermark" className="ml-2 block text-sm text-gray-700">
                Without Watermark
              </Label>
            </div>
            <div className="flex items-center ml-6">
              <RadioGroupItem value="with" id="withWatermark" />
              <Label htmlFor="withWatermark" className="ml-2 block text-sm text-gray-700">
                With Watermark
              </Label>
            </div>
          </RadioGroup>

          {/* Download Button */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#FF0050] hover:bg-[#FF0050]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF0050] transition-colors"
          >
            <span className="material-icons mr-2">file_download</span>
            Download Video
          </Button>
        </form>

        {/* Download Status */}
        <DownloadStatus state={downloadState} />
      </CardContent>
    </Card>
  );
};

export default DownloadForm;
