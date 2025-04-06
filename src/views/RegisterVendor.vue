<template>
  <div class="container1">
<<<<<<< HEAD
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
                <label for="address">Address :</label>
                <textarea
                  id="address"
                  v-model="form.address"
                  rows="3"
                  placeholder="Enter your business address"
                  class="form-input"
                  :class="{ 'input-error': v$.address.$invalid && submitted }"
                ></textarea>
                <small
                  v-if="v$.address.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.address.$errors[0].$message }}
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="manager">Manager :</label>
                <input
                  type="text"
                  id="manager"
                  v-model="form.manager"
                  placeholder="Enter manager name"
                  class="form-input"
                  :class="{ 'input-error': v$.manager.$invalid && submitted }"
                />
                <small
                  v-if="v$.manager.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.manager.$errors[0].$message }}
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="manager_phone">Manager Contact :</label>
                <input
                  type="text"
                  id="manager_phone"
                  v-model="form.manager_phone"
                  placeholder="Enter manager phone number"
                  class="form-input"
                  :class="{
                    'input-error': v$.manager_phone.$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$.manager_phone.$invalid && submitted"
                  class="error-text"
                >
                  {{ v$.manager_phone.$errors[0].$message }}
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
                  <span class="summary-label">Address:</span>
                  <span class="summary-value">{{ form.address }}</span>
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
=======
    <div class="illustration">
      <!-- <img src="/path-to-your-illustration.png" alt="Illustration" /> -->
    </div>
    <div class="form-container">
      <h2>Vendor Registration</h2>
      <form @submit.prevent="submitForm">
        <div class="insideform">
          <div class="leftbox">
            <label for="name">Name :</label>
            <InputText v-model="form.name" type="text" variant="filled" />

            <label for="email">Email :</label>
            <InputText v-model="form.email" type="text" variant="filled" />

            <label for="password">Password :</label>
            <InputText v-model="form.password" type="password" variant="filled" />

            <label for="copy_number">Copy of Number :</label>
            <InputText v-model="form.copy_number" type="text" variant="filled" />
          </div>
          <div>
            <label for="branch">Branch :</label>
            <InputText v-model="form.branch" type="text" variant="filled" />

            <label for="phone">Phone :</label>
            <InputText v-model="form.phone" type="text" variant="filled" />

            <label for="Manager">Manager :</label>
            <InputText v-model="form.Manager" type="text" variant="filled" />

            <label for="ManagerPhone">Manager Phone :</label>
            <InputText v-model="form.ManagerPhone" type="text" variant="filled" />
          </div>
        </div>

        <label for="address">Address :</label>
        <Textarea v-model="form.address" autoResize rows="5" cols="30" />

        <label>Upload Image:</label>
        <div style="display: flex; justify-content: flex-start; margin: 1rem 0 1rem 0; align-items: center;">
          <FileUpload
            mode="basic"
            accept="image/*"
            @select="onImageSelect"
            customUpload
            auto
            class="p-button-outlined"
            style="font-size: small;"
          />
          <span v-if="imageName" style="margin-left: 1rem;">Selected: {{ imageName }}</span>
        </div>

        <label class="mt-4">Upload File:</label>
        <div style="display: flex; justify-content: flex-start; margin: 1rem 0 0 0; align-items: center;">
          <FileUpload
            mode="basic"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            @select="onFileSelect"
            customUpload
            auto
            class="p-button-outlined"
            style="font-size: small;"
          />
          <span v-if="fileName" style="margin-left: 1rem;">Selected: {{ fileName }}</span>
        </div>
        <button type="submit" class="button1">Register</button>
      </form>
>>>>>>> refs/remotes/origin/develop
    </div>
  </div>
</template>

<script setup>
<<<<<<< HEAD
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
  uploadVendorImages,
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

// Form data - expanded to include all needed fields from the JSON
=======
import { ref } from 'vue';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

>>>>>>> refs/remotes/origin/develop
const form = ref({
  // Step 1 - Basic Information
  name: '',
  email: '',
  phone: '',
  address: '',
<<<<<<< HEAD
  manager: '',
  manager_phone: '',

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

// Form validation rules - separated by steps
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
    address: {
      required: helpers.withMessage('Address is required', required),
      minLength: helpers.withMessage(
        'Address must be at least 5 characters',
        minLength(5)
      ),
    },
    manager: {
      required: helpers.withMessage('Manager name is required', required),
    },
    manager_phone: {
      required: helpers.withMessage('Manager phone is required', required),
      validPhone: helpers.withMessage(
        'Please enter a valid phone number',
        helpers.regex(
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/
        )
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
=======
});


const selectedImage = ref(null)
const imageName = ref(null)
const selectedFile = ref(null)
const fileName = ref(null)
>>>>>>> refs/remotes/origin/develop

const onImageSelect = (event) => {
  const file = event.files[0]
  selectedImage.value = file
  imageName.value = file.name
}

const onFileSelect = (event) => {
  const file = event.files[0]
  selectedFile.value = file
  fileName.value = file.name
}

const submitForm = async () => {
  const formData = new FormData()

  // append form fields
  for (const key in form.value) {
    formData.append(key, form.value[key])
  }

  // append files
  if (selectedImage.value) {
    formData.append('image', selectedImage.value)
  }

// Reset the form errors on step change
watch(currentStep, () => {
  submitted.value = false;
});

// Check if we have an invitation token in the URL
onMounted(async () => {
  // Get token from query parameter if it exists
  const urlToken = route.query.token;

  if (urlToken) {
    token.value = urlToken;
    try {
      loading.value = true;
      // Validate the token and pre-fill the form with invitation data
      const response = await validateInvitationToken(urlToken);
      if (response.success && response.data) {
        const invitationData = response.data;
        // Pre-fill form with data from invitation
        form.value.email = invitationData.email || '';
        form.value.name = invitationData.businessName || '';
        // Generate username from email (remove domain part)
        form.value.username = form.value.email.split('@')[0] || '';
        // Pre-fill other fields if available
        form.value.phone = invitationData.contactPhone || '';
        form.value.address = invitationData.businessAddress || '';
      }
    } catch (error) {
      console.error('Error validating token:', error);
      errorMessage.value =
        'Invalid or expired invitation token. Please contact support.';
      toast.error(errorMessage.value, {
        position: 'top-right',
        duration: 5000,
      });
    } finally {
      loading.value = false;
    }
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

    // Prepare the data to send to the API in the expected format
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
      // Additional fields not directly in the JSON structure
      username: form.value.username,
      manager: form.value.manager,
      manager_phone: form.value.manager_phone,
      address: form.value.address,
      status: 'active',
    };

    // Register the vendor
    const response = await registerVendor(vendorData, token.value);

    // If we have a vendorId, upload logo, banner and other images
    if (response.data && response.data.vendor && response.data.vendor.id) {
      const vendorId = response.data.vendor.id;

      // Upload logo if available
      if (logoFile.value) {
        const logoFormData = new FormData();
        logoFormData.append('logo', logoFile.value);
        await uploadVendorImages(vendorId, logoFormData, 'logo');
      }

      // Upload banner if available
      if (bannerFile.value) {
        const bannerFormData = new FormData();
        bannerFormData.append('banner', bannerFile.value);
        await uploadVendorImages(vendorId, bannerFormData, 'banner');
      }

      // Upload additional images
      if (selectedFiles.value.length > 0) {
        const formData = new FormData();

        // Append all files to the FormData
        selectedFiles.value.forEach(file => {
          formData.append('images', file);
        });

        await uploadVendorImages(vendorId, formData, 'gallery');
      }
    }

    // Show success message
    toast.success('Your vendor account has been created successfully!', {
      position: 'top-right',
      duration: 5000,
    });

    // Redirect to login page or dashboard
    setTimeout(() => {
      router.push('/');
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

<<<<<<< HEAD
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
=======
.insideform {
  display: flex;
  flex-direction: row;
}

.leftbox {
  margin-right: 1rem;
}

.button1 {
  margin-top: 1.5rem;
  padding: 0.7rem;
>>>>>>> refs/remotes/origin/develop
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
<<<<<<< HEAD
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
=======
  border: 0.5px solid #a0a0a0;
  border-radius: 10px;
  position: relative;
>>>>>>> refs/remotes/origin/develop
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
<<<<<<< HEAD
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
=======
  background-color: white;
  padding: 2px 5px;
  border-radius: 50%;
>>>>>>> refs/remotes/origin/develop
}
</style>
