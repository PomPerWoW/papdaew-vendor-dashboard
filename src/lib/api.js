import axios from 'axios';

// Create API instances for each service
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
  withCredentials: true, // Include cookies with every request
});

// Create specific API instance for vendor service
const vendorApi = axios.create({
  baseURL: '/api/v1/vendors',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// Create API instance for admin service
const adminApi = axios.create({
  baseURL: '/api/v1/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// Error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

// Vendor registration API
export const registerVendor = async (vendorData, token) => {
  try {
    // If token is provided, use the invitation registration endpoint
    if (token) {
      const response = await adminApi.post(
        `/vendor-invitations/token/${token}/register`,
        vendorData
      );
      return response.data;
    } else {
      // Direct vendor registration (if allowed)
      const response = await vendorApi.post('', vendorData);
      return response.data;
    }
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
};

// Validate invitation token
export const validateInvitationToken = async token => {
  try {
    const response = await adminApi.get(
      `/vendor-invitations/token/${token}/validate`
    );
    return response.data;
  } catch (error) {
    console.error('Error validating invitation token:', error);
    throw error;
  }
};

// Upload vendor images
export const uploadVendorImages = async (vendorId, formData) => {
  try {
    const response = await vendorApi.post(`/${vendorId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading vendor images:', error);
    throw error;
  }
};

export default {
  registerVendor,
  validateInvitationToken,
  uploadVendorImages,
};
