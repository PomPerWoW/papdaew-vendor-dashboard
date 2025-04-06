/**
 * Utility functions for file uploads and image handling
 */

/**
 * Convert a File object to a base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - A promise that resolves to the base64 string
 */
export const fileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Create an image preview URL from a file
 * @param {File} file - The image file
 * @returns {string} - URL for the image preview
 */
export const createImagePreview = file => {
  return URL.createObjectURL(file);
};

/**
 * Validate file size
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} - Whether the file is valid
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type (only images)
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is a valid image
 */
export const validateImageType = file => {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];
  return validTypes.includes(file.type);
};

/**
 * Format file size for display
 * @param {number} bytes - The file size in bytes
 * @returns {string} - Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Handle file selection from input and validate
 * @param {Event} event - File input change event
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {Object} - Object containing validity and file info
 */
export const handleFileSelection = (event, maxSizeMB = 5) => {
  const file = event.target.files[0];
  if (!file) return { valid: false, error: 'No file selected' };

  if (!validateImageType(file)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload an image.',
    };
  }

  if (!validateFileSize(file, maxSizeMB)) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${maxSizeMB} MB.`,
    };
  }

  return {
    valid: true,
    file,
    preview: createImagePreview(file),
    size: formatFileSize(file.size),
  };
};

export default {
  fileToBase64,
  createImagePreview,
  validateFileSize,
  validateImageType,
  formatFileSize,
  handleFileSelection,
};
