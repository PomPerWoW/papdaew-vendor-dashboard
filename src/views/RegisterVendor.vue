<template>
  <div class="container1">
    <div class="registration-card">
      <div class="illustration-container">
        <button
          class="back-button"
          @click="goToPreviousStep"
          v-if="currentStep > 1"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#E6F0EB" />
            <path
              d="M15 11H10.83L12.42 9.41L11 8L7 12L11 16L12.41 14.59L10.83 13H15V11Z"
              fill="#6B9080"
            />
          </svg>
        </button>
        <div class="illustration">
          <img
            src="../assets/register-vector-image.png"
            alt="Vendor Registration"
          />
        </div>
      </div>

      <div class="form-side">
        <!-- Step Indicator -->
        <div class="step-indicator">
          <div
            class="step"
            :class="{ current: currentStep === 1, completed: currentStep > 1 }"
          >
            01
          </div>
          <div
            class="step-line"
            :class="{ 'completed-line': currentStep > 1 }"
          ></div>
          <div
            class="step"
            :class="{ current: currentStep === 2, completed: currentStep > 2 }"
          >
            02
          </div>
          <div
            class="step-line"
            :class="{ 'completed-line': currentStep > 2 }"
          ></div>
          <div class="step" :class="{ current: currentStep === 3 }">03</div>
        </div>

        <h2>Vendor Registration</h2>
        <h3 class="step-title">
          {{
            currentStep === 1
              ? 'Basic Information'
              : currentStep === 2
                ? 'Business Details'
                : 'Operating Hours'
          }}
        </h3>

        <!-- Add debug button at the top of the form -->
        <div class="debug-section" v-if="isDevelopment">
          <button type="button" class="debug-button" @click="prefillTestData">
            Prefill Test Data (Development Only)
          </button>
        </div>

        <form @submit.prevent="submitForm">
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 1">
            <div class="form-row">
              <div class="form-group full-width">
                <label for="name">Business Name :</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  placeholder="Enter your business name"
                  class="form-input"
                  :class="{ 'input-error': v$.name.$invalid && submitted }"
                />
                <small v-if="v$.name.$invalid && submitted" class="error-text">
                  {{ v$.name.$errors[0].$message }}
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email :</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  placeholder="info@xyz.com"
                  class="form-input"
                  :class="{ 'input-error': v$.email.$invalid && submitted }"
                />
                <small v-if="v$.email.$invalid && submitted" class="error-text">
                  {{ v$.email.$errors[0].$message }}
                </small>
              </div>

              <div class="form-group">
                <label for="phone">Mobile No. :</label>
                <input
                  type="text"
                  id="phone"
                  v-model="form.phone"
                  placeholder="+91 - 98596 59000"
                  class="form-input"
                  :class="{ 'input-error': v$.phone.$invalid && submitted }"
                />
                <small v-if="v$.phone.$invalid && submitted" class="error-text">
                  {{ v$.phone.$errors[0].$message }}
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="addressLine1">Address Line 1 :</label>
                <input
                  type="text"
                  id="addressLine1"
                  v-model="form.addressLine1"
                  placeholder="Street address, building name, floor, etc."
                  class="form-input"
                  :class="{
                    'input-error': v$.addressLine1.$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$.addressLine1.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.addressLine1.$errors[0].$message }}
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="addressLine2">Address Line 2 (Optional) :</label>
                <input
                  type="text"
                  id="addressLine2"
                  v-model="form.addressLine2"
                  placeholder="Additional address details"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="subdistrict">Subdistrict :</label>
                <input
                  type="text"
                  id="subdistrict"
                  v-model="form.subdistrict"
                  placeholder="Enter subdistrict"
                  class="form-input"
                  :class="{
                    'input-error': v$.subdistrict.$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$.subdistrict.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.subdistrict.$errors[0].$message }}
                </small>
              </div>

              <div class="form-group">
                <label for="district">District :</label>
                <input
                  type="text"
                  id="district"
                  v-model="form.district"
                  placeholder="Enter district"
                  class="form-input"
                  :class="{ 'input-error': v$.district.$invalid && submitted }"
                />
                <small
                  v-if="v$.district.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.district.$errors[0].$message }}
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="province">Province :</label>
                <input
                  type="text"
                  id="province"
                  v-model="form.province"
                  placeholder="Enter province"
                  class="form-input"
                  :class="{ 'input-error': v$.province.$invalid && submitted }"
                />
                <small
                  v-if="v$.province.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.province.$errors[0].$message }}
                </small>
              </div>

              <div class="form-group">
                <label for="postalCode">Postal Code :</label>
                <input
                  type="text"
                  id="postalCode"
                  v-model="form.postalCode"
                  placeholder="Enter postal code"
                  class="form-input"
                  :class="{
                    'input-error': v$.postalCode.$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$.postalCode.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.postalCode.$errors[0].$message }}
                </small>
              </div>
            </div>
          </div>

          <!-- Step 2: Business Details -->
          <div v-if="currentStep === 2">
            <div class="form-row">
              <div class="form-group full-width">
                <label for="businessDescription">Business Description :</label>
                <textarea
                  id="businessDescription"
                  v-model="form.businessDescription"
                  rows="4"
                  placeholder="Describe your business, products and services"
                  class="form-input"
                  :class="{
                    'input-error': v$.businessDescription.$invalid && submitted,
                  }"
                ></textarea>
                <small
                  v-if="v$.businessDescription.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.businessDescription.$errors[0].$message }}
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="businessType">Business Type :</label>
                <select
                  id="businessType"
                  v-model="form.businessType"
                  class="form-input"
                  :class="{
                    'input-error': v$.businessType.$invalid && submitted,
                  }"
                >
                  <option
                    v-for="type in businessTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
                <small
                  v-if="v$.businessType.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.businessType.$errors[0].$message }}
                </small>
              </div>

              <div class="form-group">
                <label for="website">Website (Optional) :</label>
                <input
                  type="text"
                  id="website"
                  v-model="form.website"
                  placeholder="https://www.yourbusiness.com"
                  class="form-input"
                  :class="{ 'input-error': v$.website.$invalid && submitted }"
                />
                <small
                  v-if="v$.website.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.website.$errors[0].$message }}
                </small>
              </div>
            </div>

            <h4 class="section-title">Social Media (Optional)</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="facebook">Facebook :</label>
                <input
                  type="text"
                  id="facebook"
                  v-model="form.socialMedia.facebook"
                  placeholder="https://www.facebook.com/yourbusiness"
                  class="form-input"
                  :class="{
                    'input-error':
                      v$['socialMedia.facebook'].$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$['socialMedia.facebook'].$invalid && submitted"
                  class="error-text"
                >
                  {{ v$['socialMedia.facebook'].$errors[0].$message }}
                </small>
              </div>

              <div class="form-group">
                <label for="instagram">Instagram :</label>
                <input
                  type="text"
                  id="instagram"
                  v-model="form.socialMedia.instagram"
                  placeholder="https://www.instagram.com/yourbusiness"
                  class="form-input"
                  :class="{
                    'input-error':
                      v$['socialMedia.instagram'].$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$['socialMedia.instagram'].$invalid && submitted"
                  class="error-text"
                >
                  {{ v$['socialMedia.instagram'].$errors[0].$message }}
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="twitter">Twitter :</label>
                <input
                  type="text"
                  id="twitter"
                  v-model="form.socialMedia.twitter"
                  placeholder="https://twitter.com/yourbusiness"
                  class="form-input"
                  :class="{
                    'input-error':
                      v$['socialMedia.twitter'].$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$['socialMedia.twitter'].$invalid && submitted"
                  class="error-text"
                >
                  {{ v$['socialMedia.twitter'].$errors[0].$message }}
                </small>
              </div>

              <div class="form-group">
                <label for="line">Line ID :</label>
                <input
                  type="text"
                  id="line"
                  v-model="form.socialMedia.line"
                  placeholder="@yourbusiness"
                  class="form-input"
                />
              </div>
            </div>

            <h4 class="section-title">Upload Images</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="logo">Logo :</label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  @change="handleLogoUpload"
                  class="form-input file-input"
                />
                <div class="image-preview" v-if="logoPreview">
                  <img
                    :src="logoPreview"
                    class="preview-img"
                    alt="Logo Preview"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="banner">Banner Image :</label>
                <input
                  type="file"
                  id="banner"
                  accept="image/*"
                  @change="handleBannerUpload"
                  class="form-input file-input"
                />
                <div class="image-preview banner-preview" v-if="bannerPreview">
                  <img
                    :src="bannerPreview"
                    class="preview-img"
                    alt="Banner Preview"
                  />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="galleryImages">Additional Images :</label>
                <input
                  type="file"
                  id="galleryImages"
                  accept="image/*"
                  @change="handleFileUpload"
                  multiple
                  class="form-input file-input"
                />
                <div class="images" v-if="imageSrc.length > 0">
                  <div
                    v-for="(src, index) in imageSrc"
                    :key="index"
                    class="images-lists"
                  >
                    <div class="image-container">
                      <img :src="src" class="image-style" />
                    </div>
                    <div class="cross-icon" @click="removeItem(index)">
                      <img src="../assets/cancel.svg" alt="Remove" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Operating Hours -->
          <div v-if="currentStep === 3">
            <div class="operating-hours-container">
              <h4 class="section-title">Business Hours</h4>
              <p class="section-description">Set your regular business hours</p>

              <div
                class="day-hours"
                v-for="(day, index) in form.businessHours"
                :key="index"
              >
                <div class="day-name">{{ getDayName(day.day) }}</div>
                <div class="hours-inputs">
                  <div class="closed-toggle">
                    <label>
                      <input type="checkbox" v-model="day.isClosed" /> Closed
                    </label>
                  </div>
                  <div class="time-inputs" v-if="!day.isClosed">
                    <input
                      type="time"
                      v-model="day.open"
                      class="time-input"
                      :disabled="day.isClosed"
                    />
                    <span class="time-separator">to</span>
                    <input
                      type="time"
                      v-model="day.close"
                      class="time-input"
                      :disabled="day.isClosed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary of information -->
            <div class="summary-container">
              <h4 class="section-title">Review Your Information</h4>
              <div class="summary-section">
                <h5>Basic Information</h5>
                <div class="summary-row">
                  <span class="summary-label">Business Name:</span>
                  <span class="summary-value">{{ form.name }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Email:</span>
                  <span class="summary-value">{{ form.email }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Phone:</span>
                  <span class="summary-value">{{ form.phone }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Address Information:</span>
                </div>
                <!-- Summary of address information -->
                <div class="summary-row">
                  <span class="summary-label">Address Line 1:</span>
                  <span class="summary-value">{{ form.addressLine1 }}</span>
                </div>
                <div class="summary-row" v-if="form.addressLine2">
                  <span class="summary-label">Address Line 2:</span>
                  <span class="summary-value">{{ form.addressLine2 }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Subdistrict:</span>
                  <span class="summary-value">{{ form.subdistrict }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">District:</span>
                  <span class="summary-value">{{ form.district }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Province:</span>
                  <span class="summary-value">{{ form.province }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Postal Code:</span>
                  <span class="summary-value">{{ form.postalCode }}</span>
                </div>
              </div>

              <div class="summary-section">
                <h5>Business Details</h5>
                <div class="summary-row">
                  <span class="summary-label">Type:</span>
                  <span class="summary-value">{{
                    businessTypes.find(t => t.value === form.businessType)
                      ?.label
                  }}</span>
                </div>
                <div class="summary-row" v-if="form.website">
                  <span class="summary-label">Website:</span>
                  <span class="summary-value">{{ form.website }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Description:</span>
                  <span class="summary-value description">{{
                    form.businessDescription
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <button type="submit" class="enroll-button" :disabled="loading">
              {{
                loading
                  ? 'Please wait...'
                  : currentStep < totalSteps
                    ? 'Next'
                    : 'Enroll'
              }}
            </button>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  email,
  minLength,
  helpers,
  url,
} from '@vuelidate/validators';
import {
  registerVendor,
  validateInvitationToken,
  acceptInvitation,
  createLocation,
} from '../lib/api';
import { handleFileSelection } from '../lib/fileUpload';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const token = ref(null);
const loading = ref(false);
const errorMessage = ref('');
const submitted = ref(false);
const currentStep = ref(1);
const totalSteps = 3;

// Fix the isDevelopment variable
const isDevelopment = ref(true); // Force to true for development testing

// Form data - expanded to include all needed fields from the JSON
const form = ref({
  // Step 1 - Basic Information
  name: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  district: '',
  subdistrict: '',
  province: '',
  postalCode: '',

  // Step 2 - Business Details
  businessDescription: '',
  businessType: 'RESTAURANT',
  website: '',
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    line: '',
  },

  // Step 3 - Operating Hours
  businessHours: [
    { day: 0, open: '09:00', close: '18:00', isClosed: false }, // Sunday
    { day: 1, open: '09:00', close: '18:00', isClosed: false }, // Monday
    { day: 2, open: '09:00', close: '18:00', isClosed: false }, // Tuesday
    { day: 3, open: '09:00', close: '18:00', isClosed: false }, // Wednesday
    { day: 4, open: '09:00', close: '18:00', isClosed: false }, // Thursday
    { day: 5, open: '09:00', close: '18:00', isClosed: false }, // Friday
    { day: 6, open: '09:00', close: '18:00', isClosed: false }, // Saturday
  ],

  username: '', // Will be generated from email
  images: [], // For logo and banner
  status: 'active',
});

// Get day names for the business hours
const getDayName = dayIndex => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[dayIndex];
};

// Business types options
const businessTypes = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'SALON', label: 'Salon/Spa' },
  { value: 'CLINIC', label: 'Medical Clinic' },
  { value: 'RETAIL', label: 'Retail Store' },
  { value: 'SERVICE', label: 'Service Provider' },
  { value: 'OTHER', label: 'Other' },
];

// Update validation rules for the address fields
const step1Rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('Vendor name is required', required),
      minLength: helpers.withMessage(
        'Name must be at least 2 characters',
        minLength(2)
      ),
    },
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('Please enter a valid email address', email),
    },
    phone: {
      required: helpers.withMessage('Phone number is required', required),
      validPhone: helpers.withMessage(
        'Please enter a valid phone number',
        helpers.regex(
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/
        )
      ),
    },
    addressLine1: {
      required: helpers.withMessage('Address line 1 is required', required),
      minLength: helpers.withMessage(
        'Address must be at least 5 characters',
        minLength(5)
      ),
    },
    district: {
      required: helpers.withMessage('District is required', required),
    },
    subdistrict: {
      required: helpers.withMessage('Subdistrict is required', required),
    },
    province: {
      required: helpers.withMessage('Province is required', required),
    },
    postalCode: {
      required: helpers.withMessage('Postal code is required', required),
      validPostalCode: helpers.withMessage(
        'Please enter a valid postal code (5 digits)',
        helpers.regex(/^\d{5}$/)
      ),
    },
  };
});

const step2Rules = computed(() => {
  return {
    businessDescription: {
      required: helpers.withMessage(
        'Business description is required',
        required
      ),
      minLength: helpers.withMessage(
        'Description must be at least 10 characters',
        minLength(10)
      ),
    },
    businessType: {
      required: helpers.withMessage('Business type is required', required),
    },
    website: {
      validUrl: helpers.withMessage('Please enter a valid URL', url),
    },
    'socialMedia.facebook': {
      validUrl: helpers.withMessage(
        'Please enter a valid Facebook URL',
        value => !value || url(value)
      ),
    },
    'socialMedia.instagram': {
      validUrl: helpers.withMessage(
        'Please enter a valid Instagram URL',
        value => !value || url(value)
      ),
    },
    'socialMedia.twitter': {
      validUrl: helpers.withMessage(
        'Please enter a valid Twitter URL',
        value => !value || url(value)
      ),
    },
  };
});

const step3Rules = computed(() => {
  return {
    businessHours: {
      validHours: helpers.withMessage(
        'Please enter valid business hours',
        value => {
          if (!value || !Array.isArray(value)) return false;

          // Check that each day has valid open/close times if not closed
          return value.every(day => {
            if (day.isClosed) return true;
            return day.open && day.close && day.open < day.close;
          });
        }
      ),
    },
  };
});

// Rules based on current step
const rules = computed(() => {
  switch (currentStep.value) {
    case 1:
      return step1Rules.value;
    case 2:
      return step2Rules.value;
    case 3:
      return step3Rules.value;
    default:
      return {};
  }
});

// Initialize vuelidate
const v$ = useVuelidate(rules, form);

// Track uploaded images separately for logo and banner
const imageSrc = ref([]);
const selectedFiles = ref([]);
const logoFile = ref(null);
const logoPreview = ref('');
const bannerFile = ref(null);
const bannerPreview = ref('');

// Function to go to the next step
const goToNextStep = async () => {
  submitted.value = true;

  // Validate current step
  const isValid = await v$.value.$validate();
  if (!isValid) {
    toast.error('Please check the form for errors', {
      position: 'top-right',
      duration: 5000,
    });
    return;
  }

  // If valid, increment step
  if (currentStep.value < totalSteps) {
    currentStep.value++;
    submitted.value = false;
  }
};

// Function to go to the previous step
const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    submitted.value = false;
  }
};

// Handle logo upload
const handleLogoUpload = e => {
  const result = handleFileSelection(e, 2); // 2MB limit

  if (result.valid) {
    logoFile.value = result.file;
    logoPreview.value = result.preview;
  } else {
    toast.error(result.error);
    e.target.value = ''; // Clear the file input
  }
};

// Handle banner upload
const handleBannerUpload = e => {
  const result = handleFileSelection(e, 5); // 5MB limit

  if (result.valid) {
    bannerFile.value = result.file;
    bannerPreview.value = result.preview;
  } else {
    toast.error(result.error);
    e.target.value = ''; // Clear the file input
  }
};

// Handle general image uploads
const handleFileUpload = e => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  for (let i = 0; i < files.length; i++) {
    selectedFiles.value.push(files[i]);
    const src = URL.createObjectURL(files[i]);
    imageSrc.value.push(src);
  }
};

const removeItem = index => {
  imageSrc.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
};

// Reset the form errors on step change
watch(currentStep, () => {
  submitted.value = false;
});

// Check if we have an invitation token in the URL
onMounted(async () => {
  try {
    loading.value = true;

    // Get token from query parameter if it exists
    const urlToken = route.query.token;
    token.value = urlToken || null;

    // Always validate the token
    const response = await validateInvitationToken(urlToken);
    console.log('response', response);

    if (response.success && response.data.valid) {
      const invitationData = response.data;
      // Pre-fill form with data from invitation
      form.value.email = invitationData.invitation.email || '';
      form.value.name = invitationData.invitation.businessName || '';
      // Generate username from email (remove domain part)
      form.value.username = form.value.email.split('@')[0] || '';
      // Pre-fill other fields if available
      form.value.phone = invitationData.invitation.contactPhone || '';
    } else {
      // Token validation failed, redirect to unauthorized page
      console.error('Invalid token detected');
      toast.error('Invalid or expired invitation token', {
        position: 'top-right',
        duration: 3000,
      });
      router.push('/forbidden');
    }
  } catch (error) {
    console.error('Error validating token:', error);
    errorMessage.value =
      'Invalid or expired invitation token. Please contact support.';
    toast.error(errorMessage.value, {
      position: 'top-right',
      duration: 5000,
    });

    // Redirect to unauthorized page on error
    router.push('/forbidden');
  } finally {
    loading.value = false;
  }
});

const submitForm = async () => {
  submitted.value = true;

  // For the final step, validate again
  if (currentStep.value === totalSteps) {
    const isValid = await v$.value.$validate();
    if (!isValid) {
      toast.error('Please check the form for errors', {
        position: 'top-right',
        duration: 5000,
      });
      return;
    }
  } else {
    // If not on the final step, just move to the next step
    goToNextStep();
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';

    // Generate username from email if not set
    if (!form.value.username) {
      form.value.username = form.value.email.split('@')[0];
    }

    // Accept the invitation
    await acceptInvitation(token.value);

    // Prepare location data
    const locationData = {
      name: form.value.name, // Use business name for location name
      addressLine1: form.value.addressLine1,
      addressLine2: form.value.addressLine2 || '',
      district: form.value.district,
      subdistrict: form.value.subdistrict,
      province: form.value.province,
      postalCode: form.value.postalCode,
      country: 'Thailand',
      type: 'STANDALONE',
      status: 'active',
    };

    // First create the location
    const locationResponse = await createLocation(locationData);
    const locationId = locationResponse.data.id;

    // Prepare vendor data with locationId
    const vendorData = {
      businessName: form.value.name,
      businessDescription: form.value.businessDescription,
      businessType: form.value.businessType,
      contactEmail: form.value.email,
      contactPhone: form.value.phone,
      website: form.value.website || null,
      socialMedia: {
        facebook: form.value.socialMedia.facebook || null,
        instagram: form.value.socialMedia.instagram || null,
        twitter: form.value.socialMedia.twitter || null,
        line: form.value.socialMedia.line || null,
      },
      businessHours: form.value.businessHours,
      headquartersLocationId: locationId,
      status: 'active',
    };

    // Register the vendor
    const vendorResponse = await registerVendor(vendorData);
    const vendorId = vendorResponse.data.id;

    // Show success message
    toast.success('Your vendor account has been created successfully!', {
      position: 'top-right',
      duration: 5000,
    });

    // Redirect to signup page with vendor ID
    setTimeout(() => {
      router.push(
        `/signup?vendorId=${vendorId}&businessName=${encodeURIComponent(form.value.name)}&email=${encodeURIComponent(form.value.email)}`
      );
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

// Update prefillTestData to set the testVendorId
const prefillTestData = () => {
  form.value = {
    // Step 1 - Basic Information
    name: 'KFC Thailand',
    email: 'contact@kfcthailand.com',
    phone: '+6622345678',
    addressLine1: '11/1 Central World, Floor 7',
    addressLine2: 'Rama I Road',
    district: 'Pathum Wan',
    subdistrict: 'Pathum Wan',
    province: 'Bangkok',
    postalCode: '10330',

    // Step 2 - Business Details
    businessDescription:
      'Kentucky Fried Chicken - Fast food restaurant specializing in fried chicken',
    businessType: 'RESTAURANT',
    website: 'https://www.kfcthailand.com',
    socialMedia: {
      facebook: 'https://www.facebook.com/kfcthailand',
      instagram: 'https://www.instagram.com/kfcthailand',
      twitter: 'https://twitter.com/kfcthailand',
      line: '@kfcthailand',
    },

    // Step 3 - Operating Hours
    businessHours: [
      { day: 0, open: '10:00', close: '22:00', isClosed: false }, // Sunday
      { day: 1, open: '10:00', close: '22:00', isClosed: false }, // Monday
      { day: 2, open: '10:00', close: '22:00', isClosed: false }, // Tuesday
      { day: 3, open: '10:00', close: '22:00', isClosed: false }, // Wednesday
      { day: 4, open: '10:00', close: '22:00', isClosed: false }, // Thursday
      { day: 5, open: '09:00', close: '23:00', isClosed: false }, // Friday
      { day: 6, open: '09:00', close: '23:00', isClosed: false }, // Saturday
    ],

    username: 'kfcthailand',
    images: [],
    status: 'active',
  };

  toast.success('Test data loaded!', { position: 'top-right', duration: 3000 });
};
</script>

<style scoped>
.container1 {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
}

.registration-card {
  display: flex;
  width: 90%;
  max-width: 1400px;
  min-height: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.illustration-container {
  position: relative;
  width: 40%;
  background-color: #edf5f1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.illustration {
  max-width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration img {
  max-width: 100%;
  height: auto;
}

.form-side {
  width: 60%;
  padding: 2rem 3rem;
  overflow-y: auto;
  max-height: 85vh;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.step {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  transition: all 0.3s ease;
}

.step.current {
  background-color: #6b9080;
  color: white;
}

.step.completed {
  background-color: #a4c3b2;
  color: white;
}

.step-line {
  height: 1px;
  width: 40px;
  background-color: #e0e0e0;
  margin: 0 10px;
  transition: all 0.3s ease;
}

.step-line.completed-line {
  background-color: #a4c3b2;
}

h2 {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.step-title {
  font-size: 1.1rem;
  color: #6b9080;
  margin-bottom: 1.5rem;
  font-weight: 400;
}

.section-title {
  font-size: 1rem;
  color: #333;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.section-description {
  font-size: 0.9rem;
  color: #666;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  width: 100%;
}

label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #6b9080;
  box-shadow: 0 0 0 2px rgba(107, 144, 128, 0.1);
}

.form-input::placeholder {
  color: #aaa;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b9080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
  padding-right: 30px;
}

.input-error {
  border-color: #f44336 !important;
}

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

.file-input {
  background-color: white;
  border: 1px dashed #ccc;
  padding: 15px;
}

.image-preview {
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-preview {
  width: 200px;
  height: 100px;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.enroll-button {
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 1.5rem;
}

.enroll-button:hover {
  background-color: #5a7b6c;
}

.enroll-button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  margin-top: 1rem;
  text-align: center;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.images-lists {
  position: relative;
}

.image-container {
  width: 100px;
  height: 100px;
  padding: 4px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.image-style {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cross-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  cursor: pointer;
  z-index: 1;
}

.text-center {
  text-align: center;
}

.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
  font-size: 12px;
  margin-top: 4px;
}

/* Operating hours styles */
.operating-hours-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.day-hours {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.day-hours:last-child {
  border-bottom: none;
}

.day-name {
  width: 100px;
  font-weight: 500;
  color: #333;
}

.hours-inputs {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.closed-toggle {
  margin-right: 15px;
}

.time-inputs {
  display: flex;
  align-items: center;
  flex: 1;
}

.time-input {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 6px 10px;
  width: 120px;
  color: #333;
  background-color: white;
}

.time-separator {
  margin: 0 15px;
  color: #666;
}

/* Summary section */
.summary-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.summary-section {
  margin-bottom: 20px;
}

.summary-section h5 {
  font-size: 0.95rem;
  color: #6b9080;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
}

.summary-row {
  display: flex;
  margin-bottom: 8px;
}

.summary-label {
  width: 120px;
  color: #666;
  font-weight: 500;
}

.summary-value {
  flex: 1;
  color: #333;
}

.summary-value.description {
  white-space: pre-wrap;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .registration-card {
    flex-direction: column;
    width: 100%;
  }

  .illustration-container {
    width: 100%;
    height: 200px;
  }

  .form-side {
    width: 100%;
    padding: 1.5rem;
  }

  .form-row {
    flex-direction: column;
    gap: 15px;
  }

  .day-hours {
    flex-direction: column;
    align-items: flex-start;
  }

  .day-name {
    margin-bottom: 8px;
  }

  .hours-inputs {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .time-inputs {
    margin-top: 8px;
    width: 100%;
  }

  .closed-toggle {
    margin-bottom: 8px;
  }

  .summary-row {
    flex-direction: column;
  }

  .summary-label {
    width: 100%;
    margin-bottom: 4px;
  }
}

/* Debug Section Styles */
.debug-section {
  background-color: #f8f9fa;
  border: 1px dashed #6b9080;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  position: relative;
}

.debug-button {
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.debug-button:hover {
  background-color: #5a7b6c;
}
</style>
