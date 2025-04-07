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
const authApi = axios.create({
  baseURL: '/api/v1/auth',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
  withCredentials: true, // Include cookies with every request
});

const userApi = axios.create({
  baseURL: '/api/v1/users',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
  withCredentials: true, // Include cookies with every request
});

const vendorApi = axios.create({
  baseURL: '/api/v1/vendors',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
  withCredentials: true, // Include cookies with every request
});

// Create API instance for admin service
const adminApi = axios.create({
  baseURL: '/api/v1/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true, // Enable sending cookies with requests
});

// Create API instance for location service
const locationApi = axios.create({
  baseURL: '/api/v1/locations',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true, // Enable sending cookies with requests
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

// Auth service API calls
export const signup = async userData => {
  try {
    const response = await authApi.post('/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const login = async loginData => {
  try {
    const response = await authApi.post('/login', loginData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    // Call logout endpoint to invalidate server-side session
    await authApi.post('/logout');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

export const verifyAuth = async () => {
  try {
    // Verify auth using cookies that are automatically sent with the request
    const response = await userApi.get('/me');
    return response.status === 200;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
};

// Vendor service API calls
export const registerVendor = async vendorData => {
  try {
    const response = await vendorApi.post('', vendorData);
    return response.data;
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
};

// Admin service API calls
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

export const acceptInvitation = async token => {
  try {
    const response = await adminApi.post(
      `/vendor-invitations/token/${token}/accept`
    );
    return response.data;
  } catch (error) {
    console.error('Error accepting invitation:', error);
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

export const getCurrentUser = async () => {
  try {
    const response = await userApi.get('/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export default {
  signup,
  login,
  logout,
  verifyAuth,
  getCurrentUser,
  registerVendor,
  validateInvitationToken,
  acceptInvitation,
  createLocation,
  getLocationById,
};
