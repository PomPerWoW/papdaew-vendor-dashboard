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
  baseURL: 'http://localhost:3004/api/v1/vendors',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Create API instance for admin service
const adminApi = axios.create({
  baseURL: 'http://localhost:3006/api/v1/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Create API instance for location service
const locationApi = axios.create({
  baseURL: 'http://localhost:3007/api/v1/locations',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
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
export const uploadVendorImages = async (
  vendorId,
  formData,
  imageType = 'gallery'
) => {
  try {
    // Determine the endpoint based on the image type
    let endpoint = `/${vendorId}/images`;

    // Different endpoints for different image types
    if (imageType === 'logo') {
      endpoint = `/${vendorId}/logo`;
    } else if (imageType === 'banner') {
      endpoint = `/${vendorId}/banner`;
    }

    const response = await vendorApi.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error uploading vendor ${imageType}:`, error);
    throw error;
  }
};

// Location service API calls
export const createLocation = async locationData => {
  try {
    const response = await locationApi.post('', locationData);
    return response.data;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};

export const getLocationById = async locationId => {
  try {
    const response = await locationApi.get(`/${locationId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

// Delete vendor (for test data cleanup)
export const deleteVendor = async vendorId => {
  try {
    const response = await vendorApi.delete(`/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
};

export default {
  registerVendor,
  validateInvitationToken,
  uploadVendorImages,
  createLocation,
  getLocationById,
  deleteVendor,
};
