<template>
  <div class="login-container">
    <div class="login-card">
      <div class="illustration-side">
        <img
          src="../assets/register-vector-image.png"
          alt="Branch Staff Signup"
          class="login-illustration"
        />
        <div class="overlay-text">
          <h1>Create Staff Account</h1>
          <p>Sign up branch staff to manage operations at your location</p>
        </div>
      </div>

      <div class="form-side">
        <div class="logo-container">
          <img src="../assets/logo.png" alt="Papdaew" class="logo" />
        </div>

        <h2>Branch Staff Signup</h2>
        <p class="subtitle">Create a new staff account for your branch</p>

        <div v-if="errorMessage" class="error-message">
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="submitForm" class="login-form">
          <div class="form-group">
            <label for="branch">Branch Location</label>
            <div class="select-container">
              <select
                id="branch"
                v-model="selectedBranchId"
                class="branch-select"
              >
                <option
                  v-for="branch in branches"
                  :key="branch.id"
                  :value="branch.id"
                >
                  {{ branch.branchName }}
                </option>
              </select>
            </div>
            <small class="helper-text"
              >Select the branch for this staff member</small
            >
          </div>

          <div
            class="form-group"
            :class="{ error: v$.username.$invalid && submitted }"
          >
            <label for="username">Username</label>
            <div class="input-container">
              <input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="Staff username"
                autocomplete="username"
              />
            </div>
            <small class="helper-text">Staff login username</small>
            <small v-if="v$.username.$invalid && submitted" class="error-text">
              {{ v$.username.$errors[0].$message }}
            </small>
          </div>

          <div
            class="form-group"
            :class="{ error: v$.email.$invalid && submitted }"
          >
            <label for="email">Email</label>
            <div class="input-container">
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Staff email address"
                autocomplete="email"
              />
            </div>
            <small class="helper-text">Staff email address</small>
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
                placeholder="Create a password"
                autocomplete="new-password"
              />
            </div>
            <small v-if="v$.password.$invalid && submitted" class="error-text">
              {{ v$.password.$errors[0].$message }}
            </small>
          </div>

          <div
            class="form-group"
            :class="{ error: v$.position.$invalid && submitted }"
          >
            <label for="position">Position</label>
            <div class="input-container">
              <input
                id="position"
                v-model="form.position"
                type="text"
                placeholder="Staff position/title"
              />
            </div>
            <small class="helper-text"
              >e.g., Cashier, Branch Manager, etc.</small
            >
            <small v-if="v$.position.$invalid && submitted" class="error-text">
              {{ v$.position.$errors[0].$message }}
            </small>
          </div>

          <div class="permissions-section">
            <label class="permissions-label">Staff Permissions</label>
            <div class="permissions-grid">
              <div class="permission-item">
                <input
                  type="checkbox"
                  id="canManageQueue"
                  v-model="form.permissions.canManageQueue"
                />
                <label for="canManageQueue">Manage Queue</label>
              </div>

              <div class="permission-item">
                <input
                  type="checkbox"
                  id="canManageMenu"
                  v-model="form.permissions.canManageMenu"
                />
                <label for="canManageMenu">Manage Menu</label>
              </div>

              <div class="permission-item">
                <input
                  type="checkbox"
                  id="canViewReports"
                  v-model="form.permissions.canViewReports"
                />
                <label for="canViewReports">View Reports</label>
              </div>

              <div class="permission-item">
                <input
                  type="checkbox"
                  id="canManageSettings"
                  v-model="form.permissions.canManageSettings"
                />
                <label for="canManageSettings">Manage Settings</label>
              </div>
            </div>
          </div>

          <button type="submit" class="login-button" :disabled="loading">
            <span v-if="!loading">Create Staff Account</span>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { useVuelidate } from '@vuelidate/core';
import { defineComponent } from 'vue';
import { required, minLength, helpers, email } from '@vuelidate/validators';
import { useUserStore } from '../stores/counter.js';
import { signup, getBranches } from '../lib/api';

// Define component with multi-word name
defineComponent({
  name: 'BranchStaffSignup',
});

const router = useRouter();
const route = useRoute();
const toast = useToast();
const userStore = useUserStore();

const loading = ref(false);
const errorMessage = ref(false);
const submitted = ref(false);
const branches = ref([]);
const selectedBranch = ref(null);
const selectedBranchId = ref('');

// Watch for changes in selectedBranchId to update selectedBranch object
watch(selectedBranchId, newId => {
  if (newId && branches.value.length > 0) {
    selectedBranch.value = branches.value.find(b => b.id === newId);
  }
});

// Form data
const form = ref({
  username: '',
  email: '',
  password: '',
  position: '',
  permissions: {
    canManageQueue: true,
    canManageMenu: false,
    canViewReports: false,
    canManageSettings: false,
    canManageStaff: false, // Staff usually can't manage other staff
  },
});

// Load branches when component mounts
onMounted(async () => {
  try {
    // Verify that the user is a root account and is authenticated
    if (!userStore.isRootAccount || !userStore.isAuthenticated) {
      errorMessage.value = 'Only vendor owners can create staff accounts.';

      toast.error(errorMessage.value, {
        position: 'top-right',
        duration: 3000,
      });

      setTimeout(() => {
        router.push('/forbidden');
      }, 1500);
      return;
    }

    // Get the vendor ID from the current user
    const vendorId = userStore.user.data.staff.vendorId;

    if (!vendorId) {
      throw new Error('Vendor ID not found in user data');
    }

    // Fetch branches for this vendor
    loading.value = true;
    const response = await getBranches(vendorId);
    branches.value = response.data;
    loading.value = false;

    // If branches are empty, show error and redirect
    if (branches.value.length === 0) {
      errorMessage.value = 'You need to create at least one branch first.';

      toast.error(errorMessage.value, {
        position: 'top-right',
        duration: 3000,
      });

      setTimeout(() => {
        router.push('/branch');
      }, 1500);
      return;
    }

    // If branchId is provided in URL, select that branch
    if (route.query.branchId) {
      const branchIdFromQuery = route.query.branchId;
      const matchingBranch = branches.value.find(
        b => b.id === branchIdFromQuery
      );

      if (matchingBranch) {
        selectedBranch.value = matchingBranch;
        selectedBranchId.value = matchingBranch.id;
      } else {
        // Default to first branch if specified branch not found
        selectedBranch.value = branches.value[0];
        selectedBranchId.value = branches.value[0].id;
      }
    } else {
      // Default to first branch if no branchId provided
      selectedBranch.value = branches.value[0];
      selectedBranchId.value = branches.value[0].id;
    }
  } catch (error) {
    console.error('Error loading branches:', error);
    loading.value = false;

    toast.error('Failed to load branches. Please try again.', {
      position: 'top-right',
      duration: 3000,
    });

    setTimeout(() => {
      router.push('/branch');
    }, 1500);
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
    position: {
      required: helpers.withMessage('Position is required', required),
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

  // Check if a branch is selected
  if (!selectedBranch.value) {
    toast.error('Please select a branch', {
      position: 'top-right',
      duration: 5000,
    });
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';

    // Get the vendor ID from the current user
    const vendorId = userStore.user.data.staff.vendorId;

    if (!vendorId) {
      throw new Error('Vendor ID not found in user data');
    }

    // Prepare signup data for staff creation
    const signupData = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      role: 'STAFF',
      vendorId: vendorId,
      isRoot: false,
      position: form.value.position,
      branchId: selectedBranch.value.id,
      permissions: form.value.permissions,
    };

    await signup(signupData);

    // Show success message
    toast.success('Branch staff account has been created successfully!', {
      position: 'top-right',
      duration: 5000,
    });

    // Redirect back to branch management page
    setTimeout(() => {
      router.push('/branch');
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
  max-height: 90vh;
  overflow-y: auto;
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
  overflow-y: auto;
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

.permissions-section {
  margin-top: 8px;
}

.permissions-label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.permission-item label {
  font-size: 14px;
  font-weight: normal;
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

/* Add native select styles */
.select-container {
  position: relative;
  margin-top: 4px;
}

.branch-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 15px;
  color: #333;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s;
}

.branch-select:hover {
  border-color: #6b9080;
}

.branch-select:focus {
  outline: none;
  border-color: #6b9080;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(107, 144, 128, 0.2);
}

/* Add dropdown arrow */
.select-container::after {
  content: '';
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #666;
  pointer-events: none;
}

/* Add custom scrollbar styling */
.form-side::-webkit-scrollbar {
  width: 8px;
}

.form-side::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.form-side::-webkit-scrollbar-thumb {
  background: #cce3de;
  border-radius: 4px;
}

.form-side::-webkit-scrollbar-thumb:hover {
  background: #a4c3b2;
}
</style>
