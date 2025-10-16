// cloudinary tokens
// In development/local: use hardcoded values
// In production/CI: use environment variables
const upload_presets = import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET || (typeof process !== 'undefined' ? process?.env?.VITE_CLOUDINARY_UPLOAD_PRESET : undefined);
const cloud_names = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || (typeof process !== 'undefined' ? process?.env?.VITE_CLOUDINARY_CLOUD_NAME : undefined);

// 每次上传， 随机选一个cloudinary上传
export const getUploadConfig = () => {
    const presets = upload_presets?.split(',') || [];
    const cloudNames = cloud_names?.split(',') || [];

    const randomIndex = Math.floor(Math.random() * presets.length);

    debugger;
    return { 
        upload_preset: presets[randomIndex], 
        cloud_name: cloudNames[randomIndex],
    };
}