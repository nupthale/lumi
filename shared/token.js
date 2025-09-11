// cloudinary tokens
// In development/local: use hardcoded values
// In production/CI: use environment variables
export const upload_preset = import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET || process.env?.VITE_CLOUDINARY_UPLOAD_PRESET;
export const cloud_name = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || process.env?.VITE_CLOUDINARY_CLOUD_NAME;