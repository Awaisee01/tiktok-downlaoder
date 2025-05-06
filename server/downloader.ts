import fetch, { Headers } from "node-fetch";

// Adding useragent to avoid IP bans
const headers = new Headers();
headers.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36");

// Get video ID from TikTok URL
export const getIdVideo = async (url: string): Promise<string> => {
  if (url.includes("/t/")) {
    url = await new Promise((resolve) => {
      require("follow-redirects").https.get(url, function (res: any) {
        return resolve(res.responseUrl);
      });
    });
  }
  
  const matching = url.includes("/video/");
  const matchingPhoto = url.includes("/photo/");
  
  let idVideo = url.substring(
    url.indexOf("/video/") + 7,
    url.indexOf("/video/") + 26
  );
  
  if (matchingPhoto) {
    idVideo = url.substring(
      url.indexOf("/photo/") + 7,
      url.indexOf("/photo/") + 26
    );
  } else if (!matching) {
    throw new Error("Invalid TikTok URL");
  }
  
  // Tiktok ID is usually 19 characters long and sits after /video/
  return idVideo.length > 19
    ? idVideo.substring(0, idVideo.indexOf("?"))
    : idVideo;
};

// Get video data from TikTok API
export const getVideo = async (url: string, watermark: boolean) => {
  try {
    const idVideo = await getIdVideo(url);
    const API_URL = `https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}&iid=7318518857994389254&device_id=7318517321748022790&channel=googleplay&app_name=musical_ly&version_code=300904&device_platform=android&device_type=ASUS_Z01QD&version=9`;
    
    const request = await fetch(API_URL, {
      method: "GET",
      headers: headers,
    });
    
    const body = await request.text();
    
    let res;
    try {
      res = JSON.parse(body);
    } catch (err) {
      console.error("Error parsing JSON:", err);
      console.error("Response body:", body);
      
      if (body.includes("ratelimit triggered")) {
        console.error("Rate limit triggered");
        return null;
      }
      
      return null;
    }
    
    // Safeguard against missing properties
    if (
      !res.aweme_list ||
      res.aweme_list.length === 0 ||
      res.aweme_list[0].aweme_id !== idVideo
    ) {
      console.error("Error: Video not found or deleted.");
      return null;
    }
    
    let urlMedia = "";
    let image_urls: string[] = [];
    
    // Check if video is slideshow
    if (!!res.aweme_list[0].image_post_info) {
      console.log("Video is slideshow");
      
      // Get all image urls
      res.aweme_list[0].image_post_info.images.forEach((element: any) => {
        // url_list[0] contains a webp
        // url_list[1] contains a jpeg
        image_urls.push(element.display_image.url_list[1]);
      });
    } else if (res.aweme_list[0].video) {
      urlMedia = null;
      const video = res.aweme_list[0].video;
      if (watermark) {
        if (video.download_addr && video.download_addr.url_list && video.download_addr.url_list.length > 0) {
          urlMedia = video.download_addr.url_list[0];
        }
      }
      if (urlMedia === null) {
        if (video.play_addr && video.play_addr.url_list && video.play_addr.url_list.length > 0) {
          urlMedia = video.play_addr.url_list[0];
        } else {
          console.error(
            "Error: video download_addr or play_addr or their url_list is missing."
          );
        }
      }
    } else {
      console.error(
        "Error: video or image_post_info is missing in the aweme object."
      );
    }
    
    const data = {
      url: urlMedia,
      images: image_urls,
      id: idVideo,
    };
    
    return data;
  } catch (error) {
    console.error("Error fetching video:", error);
    return null;
  }
};

// Download media function
export const downloadMedia = async (item: { id: string; url: string; images: string[] }) => {
  const folder = "downloads/";
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  
  // Check for slideshow
  if (item.images.length != 0) {
    console.log("Downloading Slideshow");
    
    let index = 0;
    item.images.forEach((image_url) => {
      const fileName = `${item.id}_${index}.jpeg`;
      // Check if file was already downloaded
      if (fs.existsSync(folder + fileName)) {
        console.log(`File '${fileName}' already exists. Skipping`);
        return;
      }
      index++;
      const downloadFile = fetch(image_url);
      const file = fs.createWriteStream(folder + fileName);
      
      downloadFile.then((res) => {
        res.body.pipe(file);
        file.on("finish", () => {
          file.close();
        });
        file.on("error", (err) => console.error(err));
      });
    });
    
    return;
  } else {
    const fileName = `${item.id}.mp4`;
    // Check if file was already downloaded
    if (fs.existsSync(folder + fileName)) {
      console.log(`File '${fileName}' already exists. Skipping`);
      return;
    }
    const downloadFile = fetch(item.url);
    const file = fs.createWriteStream(folder + fileName);
    
    downloadFile.then((res) => {
      res.body.pipe(file);
      file.on("finish", () => {
        file.close();
      });
      file.on("error", (err) => console.error(err));
    });
  }
};

import fs from "fs";
