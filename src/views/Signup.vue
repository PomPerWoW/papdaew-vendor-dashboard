<template>
  <div class="login-container">
    <div class="login-card">
      <div class="illustration-side">
        <img
          src="../assets/register-vector-image.png"
          alt="Vendor Signup"
          class="login-illustration"
        />
        <div class="overlay-text">
          <h1>Create Account</h1>
          <p>Sign up to manage your vendor business on Papdaew</p>
        </div>
      </div>

      <div class="form-side">
        <div class="logo-container">
          <img src="../assets/logo.png" alt="Papdaew" class="logo" />
        </div>

        <h2>Vendor Signup</h2>
        <p class="subtitle">Create your vendor account</p>

        <div v-if="errorMessage" class="error-message">
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="submitForm" class="login-form">
          <div
            class="form-group"
            :class="{
              error: v$.username.$invalid && submitted,
              readonly: true,
            }"
          >
            <label for="username">Username</label>
            <div class="input-container readonly">
              <input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="Choose a username"
                autocomplete="username"
                readonly
              />
            </div>
            <small class="helper-text">Your business name</small>
            <small v-if="v$.username.$invalid && submitted" class="error-text">
              {{ v$.username.$errors[0].$message }}
            </small>
          </div>

          <div
            class="form-group"
            :class="{ error: v$.email.$invalid && submitted, readonly: true }"
          >
            <label for="email">Email</label>
            <div class="input-container readonly">
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
                readonly
              />
            </div>
            <small class="helper-text">Your business email</small>
            <small v-if="v$.email.$invalid && submitted" class="error-text">
              {{ v$.email.$errors[0].$message }}
            </small>
          </div>

          <div
            class="form-group"
            :class="{ error: v$.password.$invalid && submitted }"
          >
            <label for="password">Password</label>
            <div class="input-container">
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Create a strong password"
                autocomplete="new-password"
              />
            </div>
            <small v-if="v$.password.$invalid && submitted" class="error-text">
              {{ v$.password.$errors[0].$message }}
            </small>
          </div>

          <button type="submit" class="login-button" :disabled="loading">
            <span v-if="!loading">Create Account</span>
            <span v-else class="spinner"></span>
          </button>
        </form>

        <div class="form-footer">
          &copy; {{ new Date().getFullYear() }} Papdaew. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { useVuelidate } from '@vuelidate/core';
import { defineComponent } from 'vue';
import { required, minLength, helpers, email } from '@vuelidate/validators';
import { signup } from '../lib/api';

// Define component with multi-word name
defineComponent({
  name: 'VendorSignup',
});

const router = useRouter();
const route = useRoute();
const toast = useToast();

const loading = ref(false);
const errorMessage = ref('');
const submitted = ref(false);
const vendorId = ref('');

// Form data
const form = ref({
  username: '',
  email: '',
  password: '',
});

// Get vendorId from URL query parameter
onMounted(() => {
  if (route.query.vendorId) {
    vendorId.value = route.query.vendorId;

    // Pre-fill form with data from the enroll page
    if (route.query.businessName) {
      // Use business name as username (simplified for username format)
      const businessName = route.query.businessName;
      form.value.username = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Remove special characters
        .substring(0, 20); // Limit length
    }

    if (route.query.email) {
      form.value.email = route.query.email;
    }
  } else {
    errorMessage.value =
      'Vendor ID is missing. Please start from vendor registration.';

    // Redirect to forbidden page
    toast.error(errorMessage.value, {
      position: 'top-right',
      duration: 3000,
    });

    setTimeout(() => {
      router.push('/forbidden');
    }, 1000);
  }
});

// Validation rules
const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage('Username is required', required),
      minLength: helpers.withMessage(
        'Username must be at least 3 characters',
        minLength(3)
      ),
    },
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('Invalid email address', email),
    },
    password: {
      required: helpers.withMessage('Password is required', required),
      minLength: helpers.withMessage(
        'Password must be at least 8 characters',
        minLength(8)
      ),
    },
  };
});

// Initialize vuelidate
const v$ = useVuelidate(rules, form);

// Form submission
const submitForm = async () => {
  submitted.value = true;

  // Validate form
  const isValid = await v$.value.$validate();
  if (!isValid) {
    toast.error('Please check the form for errors', {
      position: 'top-right',
      duration: 5000,
    });
    return;
  }

  // Check if vendorId is available
  if (!vendorId.value) {
    errorMessage.value =
      'Vendor ID is missing. Please start from vendor registration.';
    toast.error(errorMessage.value, {
      position: 'top-right',
      duration: 5000,
    });
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';

    // Prepare signup data with all required fields for staff creation
    const signupData = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      role: 'STAFF',
      vendorId: vendorId.value,
      isRoot: true,
      position: 'ROOT',
      // Add any other fields that might be needed for creating a staff user
      permissions: {
        canManageQueue: true,
        canManageMenu: true,
        canManageStaff: true,
        canViewReports: true,
        canManageSettings: true,
      },
    };

    await signup(signupData);

    // Show success message
    toast.success('Your vendor account has been created successfully!', {
      position: 'top-right',
      duration: 5000,
    });

    // Redirect to login page
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific error messages from the API
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value =
        'An error occurred during registration. Please try again.';
    }

    toast.error(errorMessage.value, {
      position: 'top-right',
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fa;
}

.login-card {
  width: 1000px;
  max-width: 100%;
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.illustration-side {
  width: 40%;
  background-color: #e6f0eb;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-illustration {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.overlay-text h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.overlay-text p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.form-side {
  width: 60%;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo {
  width: 150px;
  height: auto;
}

h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: center;
}

.subtitle {
  color: #666;
  text-align: center;
  margin: 8px 0 24px 0;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fdedee;
  color: #d32f2f;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.error .input-container {
  border-color: #d32f2f;
}

.form-group.readonly .input-container {
  background-color: #f0f0f0;
  border-color: #ddd;
  cursor: not-allowed;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.input-container {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
  background-color: #f9f9f9;
  transition: all 0.2s;
}

.input-container:focus-within {
  border-color: #6b9080;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(107, 144, 128, 0.2);
}

.input-container.readonly:focus-within {
  border-color: #ddd;
  background-color: #f0f0f0;
  box-shadow: none;
}

input[type='email'],
input[type='password'],
input[type='text'] {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #333;
}

input[type='email']:focus,
input[type='password']:focus,
input[type='text']:focus {
  outline: none;
}

input[readonly] {
  color: #777;
  cursor: not-allowed;
}

.helper-text {
  color: #777;
  font-size: 12px;
  margin-top: 4px;
  font-style: italic;
}

.error-text {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
}

.login-button {
  margin-top: 16px;
  padding: 14px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button:hover {
  background-color: #5a7b6c;
}

.login-button:disabled {
  background-color: #a4c3b2;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
  color: #999;
}

.registration-link {
  margin-top: 10px;
  font-size: 0.95rem;
  color: #666;
}

.registration-link a {
  color: #6b9080;
  text-decoration: none;
  font-weight: 500;
}

.registration-link a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 900px) {
  .login-card {
    flex-direction: column;
    width: 500px;
  }

  .illustration-side,
  .form-side {
    width: 100%;
  }

  .illustration-side {
    height: 200px;
  }
}

@media (max-width: 500px) {
  .form-side {
    padding: 24px;
  }

  .overlay-text h1 {
    font-size: 24px;
  }

  .overlay-text p {
    font-size: 14px;
  }
}
</style>
