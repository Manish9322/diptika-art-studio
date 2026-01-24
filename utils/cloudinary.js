import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "@/config/config";


// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});


// Generate new image name
export const generateImageName = (originalName = "image") => {
  const random = crypto.randomBytes(6).toString("hex");
  return `${originalName.split(".")[0]}-${random}`;
};


// Convert image buffer to base64
export const bufferToBase64 = (buffer, mimetype) => {
  return `data:${mimetype};base64,${buffer.toString("base64")}`;
};


// Upload SINGLE image (from buffer)
export const uploadSingleImage = async (fileBuffer, mimetype, folder = "uploads") => {
  const base64 = bufferToBase64(fileBuffer, mimetype);

  const result = await cloudinary.uploader.upload(base64, {
    folder,
    public_id: generateImageName(),
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};


// Upload base64 image directly (for JSON requests)
export const uploadBase64Image = async (base64String, folder = "uploads") => {
  // Check if base64 string already has data URI prefix
  const base64Data = base64String.startsWith('data:') ? base64String : `data:image/jpeg;base64,${base64String}`;
  
  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    public_id: generateImageName(),
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};


// Upload MULTIPLE images
export const uploadMultipleImages = async (files, folder = "uploads") => {
  const uploads = files.map((file) =>
    uploadSingleImage(file.buffer, file.mimetype, folder)
  );

  return Promise.all(uploads);
};


// Upload MULTIPLE base64 images
export const uploadMultipleBase64Images = async (base64Array, folder = "uploads") => {
  const uploads = base64Array.map((base64) =>
    uploadBase64Image(base64, folder)
  );

  return Promise.all(uploads);
};


// Fetch image URL
export const fetchImage = async (public_id) => {
  const result = await cloudinary.api.resource(public_id);
  return result.secure_url;
};
