<template>
  <div class="login-container">
    <div class="login-card">
      <div class="illustration-side">
        <img
          :src="illustrationSrc"
          alt="Vendor Login"
          class="login-illustration"
        />
        <div class="overlay-text">
          <h1>Welcome Back</h1>
          <p>Login to manage your vendor account and business</p>
        </div>
      </div>

      <div class="form-side">
        <div class="logo-container">
          <img :src="logoURL" alt="Papdaew" class="logo" />
        </div>

        <h2>Vendor Login</h2>
        <p class="subtitle">Sign in to your vendor dashboard</p>

        <div v-if="errorMessage" class="error-message">
          <Icon icon="material-symbols:error-outline" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="submitForm" class="login-form">
          <div class="form-group" :class="{ error: submitted && !form.email }">
            <label for="email">Email Address</label>
            <div class="input-container">
              <Icon icon="material-symbols:mail-outline" class="input-icon" />
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
              />
            </div>
            <small v-if="submitted && !form.email" class="error-text">
              Email is required
            </small>
            <small v-else-if="submitted && !isValidEmail" class="error-text">
              Please enter a valid email address
            </small>
          </div>

          <div
            class="form-group"
            :class="{ error: submitted && !form.password }"
          >
            <label for="password">Password</label>
            <div class="input-container">
              <Icon icon="material-symbols:lock-outline" class="input-icon" />
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <Icon
                  :icon="
                    showPassword
                      ? 'material-symbols:visibility'
                      : 'material-symbols:visibility-off'
                  "
                />
              </button>
            </div>
            <small v-if="submitted && !form.password" class="error-text">
              Password is required
            </small>
          </div>

          <div class="form-options">
            <div class="remember-me">
              <input id="remember" type="checkbox" v-model="rememberMe" />
              <label for="remember">Remember me</label>
            </div>
            <button
              type="button"
              class="forgot-password"
              @click="handleForgotPassword"
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" class="login-button" :disabled="loading">
            <span v-if="!loading">Sign In</span>
            <span v-else class="spinner"></span>
          </button>
        </form>

        <div class="form-footer">
          <p>© 2025 Papdaew. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { Icon } from '@iconify/vue';
import logoURL from '../assets/logo.png';
import illustrationSrc from '../assets/register-vector-image.png';

defineComponent({
  name: 'VendorLogin',
});

const router = useRouter();
const $toast = useToast();

const form = ref({
  email: '',
  password: '',
});

const rememberMe = ref(false);
const submitted = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

// Check email validity
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(form.value.email);
});

const submitForm = async () => {
  submitted.value = true;
  errorMessage.value = '';

  // Validate form
  if (!form.value.email || !form.value.password || !isValidEmail.value) {
    return;
  }

  try {
    loading.value = true;

    // Here you would call your authentication API
    // For now, we'll simulate an API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store token and user data
    if (rememberMe.value) {
      localStorage.setItem('rememberVendorLogin', 'true');
    }

    // Store auth token (from real API response)
    localStorage.setItem('vendorAuthToken', 'sample-token');

    // Show success message
    $toast.success('Login successful! Redirecting to dashboard...', {
      position: 'top-right',
      duration: 3000,
    });

    // Redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard-vendor');
    }, 1000);
  } catch (error) {
    console.error('Login error:', error);

    // Show error message
    errorMessage.value = 'Invalid email or password. Please try again.';

    $toast.error('Login failed. Please check your credentials.', {
      position: 'top-right',
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  // In a real app, you would implement a forgot password flow
  $toast.info('Forgot password feature will be available soon.', {
    position: 'top-right',
    duration: 3000,
  });
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

.error-message svg {
  flex-shrink: 0;
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

.input-icon {
  color: #888;
  margin-right: 8px;
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

.password-toggle {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.error-text {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input[type='checkbox'] {
  margin-right: 8px;
}

.forgot-password {
  color: #6b9080;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}

.forgot-password:hover {
  text-decoration: underline;
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
  margin-top: 32px;
  text-align: center;
}

.form-footer p {
  color: #666;
  margin: 0 0 8px 0;
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
