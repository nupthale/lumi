// cloudinary tokens
// In development/local: use hardcoded values
// In production/CI: use environment variables
export const upload_preset = import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET || (typeof process !== 'undefined' ? process?.env?.VITE_CLOUDINARY_UPLOAD_PRESET : undefined);
export const cloud_name = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || (typeof process !== 'undefined' ? process?.env?.VITE_CLOUDINARY_CLOUD_NAME : undefined);