import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { downloadRequestSchema } from "@shared/schema";
import { getVideo, getIdVideo, downloadMedia } from "./downloader";
import { ZodError } from "zod";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create downloads directory if it doesn't exist
  const downloadsDir = path.join(process.cwd(), "downloads");
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  // API endpoint to download TikTok video
  app.post("/api/download", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const { url, watermark } = downloadRequestSchema.parse(req.body);
      
      // Process URL to get video ID
      const videoId = await getIdVideo(url);
      
      // Get video data
      const videoData = await getVideo(url, watermark);
      
      if (!videoData) {
        return res.status(500).json({ message: "Failed to fetch video data" });
      }
      
      // Generate download URL
      if (videoData.images.length > 0) {
        // Handle slideshows (not implemented in frontend currently)
        return res.json({
          success: true,
          type: "slideshow",
          id: videoData.id,
          message: "This is a slideshow, not a video"
        });
      } else {
        // Return the video URL for frontend to download
        return res.json({
          success: true,
          type: "video",
          id: videoData.id,
          url: videoData.url
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ 
        message: "An error occurred while processing your request"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
