<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ editMode ? 'Edit Branch' : 'Add New Branch' }}</h2>
        <button class="close-button" @click="closeModal">
          <Icon icon="material-symbols:close" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="branch-form">
        <!-- Debug button - only visible in development -->
        <div class="debug-section" v-if="isDevelopment">
          <button type="button" class="debug-button" @click="prefillTestData">
            Prefill Test Data (Development Only)
          </button>
        </div>

        <div class="form-section">
          <h3 class="section-title">Branch Details</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="branchName">Branch Name*</label>
              <input
                id="branchName"
                v-model="formData.name"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.name }"
                placeholder="Enter branch name"
              />
              <small v-if="submitted && !formData.name" class="error-text">
                Branch name is required
              </small>
            </div>

            <div class="form-group">
              <label for="branchType">Branch Type*</label>
              <select
                id="branchType"
                v-model="formData.type"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.type }"
              >
                <option value="" disabled selected>Select branch type</option>
                <option value="main">Main Branch</option>
                <option value="sub">Sub Branch</option>
                <option value="kiosk">Kiosk</option>
                <option value="flagship">Flagship Store</option>
              </select>
              <small v-if="submitted && !formData.type" class="error-text">
                Branch type is required
              </small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="branchCode">Branch Code*</label>
              <input
                id="branchCode"
                v-model="formData.branchCode"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.branchCode }"
                placeholder="Enter branch code (e.g. BKK001)"
              />
              <small
                v-if="submitted && !formData.branchCode"
                class="error-text"
              >
                Branch code is required
              </small>
            </div>

            <div class="form-group">
              <label for="status">Status*</label>
              <select
                id="status"
                v-model="formData.status"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.status }"
              >
                <option value="" disabled selected>Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="temporary-closed">Temporarily Closed</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
              <small v-if="submitted && !formData.status" class="error-text">
                Status is required
              </small>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Contact Information</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="manager">Manager Name*</label>
              <input
                id="manager"
                v-model="formData.manager"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.manager }"
                placeholder="Enter manager name"
              />
              <small v-if="submitted && !formData.manager" class="error-text">
                Manager name is required
              </small>
            </div>

            <div class="form-group">
              <label for="email">Email Address*</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                :class="{ 'input-error': submitted && !isValidEmail }"
                placeholder="Enter email address"
              />
              <small v-if="submitted && !formData.email" class="error-text">
                Email is required
              </small>
              <small v-else-if="submitted && !isValidEmail" class="error-text">
                Please enter a valid email
              </small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phone">Phone Number*</label>
              <input
                id="phone"
                v-model="formData.phone"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.phone }"
                placeholder="Enter phone number"
              />
              <small v-if="submitted && !formData.phone" class="error-text">
                Phone number is required
              </small>
            </div>

            <div class="form-group">
              <label for="hours">Operating Hours*</label>
              <input
                id="hours"
                v-model="formData.hours"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.hours }"
                placeholder="e.g. 9:00 AM - 9:00 PM"
              />
              <small v-if="submitted && !formData.hours" class="error-text">
                Operating hours are required
              </small>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Location Details</h3>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="addressLine1">Address Line 1*</label>
              <input
                id="addressLine1"
                v-model="formData.addressLine1"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.addressLine1 }"
                placeholder="Street address, building name, floor, etc."
              />
              <small
                v-if="submitted && !formData.addressLine1"
                class="error-text"
              >
                Address line 1 is required
              </small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="addressLine2">Address Line 2 (Optional)</label>
              <input
                id="addressLine2"
                v-model="formData.addressLine2"
                type="text"
                class="form-input"
                placeholder="Additional address details"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="subdistrict">Subdistrict*</label>
              <input
                id="subdistrict"
                v-model="formData.subdistrict"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.subdistrict }"
                placeholder="Enter subdistrict"
              />
              <small
                v-if="submitted && !formData.subdistrict"
                class="error-text"
              >
                Subdistrict is required
              </small>
            </div>

            <div class="form-group">
              <label for="district">District*</label>
              <input
                id="district"
                v-model="formData.district"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.district }"
                placeholder="Enter district"
              />
              <small v-if="submitted && !formData.district" class="error-text">
                District is required
              </small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="province">Province*</label>
              <input
                id="province"
                v-model="formData.province"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.province }"
                placeholder="Enter province"
              />
              <small v-if="submitted && !formData.province" class="error-text">
                Province is required
              </small>
            </div>

            <div class="form-group">
              <label for="postalCode">Postal Code*</label>
              <input
                id="postalCode"
                v-model="formData.postalCode"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !formData.postalCode }"
                placeholder="Enter 5-digit postal code"
              />
              <small
                v-if="submitted && !formData.postalCode"
                class="error-text"
              >
                Postal code is required
              </small>
              <small
                v-else-if="submitted && !isValidPostalCode"
                class="error-text"
              >
                Please enter a valid 5-digit postal code
              </small>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Business Hours</h3>
          <div class="operating-hours-container">
            <div
              v-for="(dayHours, index) in formData.businessHours"
              :key="index"
              class="day-hours"
            >
              <div class="day-name">{{ getDayName(dayHours.day) }}</div>
              <div class="hours-inputs">
                <div class="closed-toggle">
                  <label class="checkbox-container">
                    Closed
                    <input
                      type="checkbox"
                      v-model="dayHours.isClosed"
                      @change="validateHours(dayHours)"
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>
                <div
                  class="time-inputs"
                  :class="{ disabled: dayHours.isClosed }"
                >
                  <input
                    type="time"
                    v-model="dayHours.open"
                    class="time-input"
                    :disabled="dayHours.isClosed"
                    :class="{
                      'input-error': submitted && !isHoursValid(dayHours),
                    }"
                  />
                  <span class="time-separator">to</span>
                  <input
                    type="time"
                    v-model="dayHours.close"
                    class="time-input"
                    :disabled="dayHours.isClosed"
                    :class="{
                      'input-error': submitted && !isHoursValid(dayHours),
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
          <small v-if="submitted && !areBusinessHoursValid" class="error-text">
            Please enter valid operating hours. Opening time must be before
            closing time.
          </small>
        </div>

        <div class="form-section">
          <h3 class="section-title">Branch Image</h3>

          <div class="image-upload-container">
            <div
              class="image-preview"
              :class="{ 'has-image': imagePreview }"
              :style="
                imagePreview ? `background-image: url(${imagePreview})` : ''
              "
            >
              <div v-if="!imagePreview" class="upload-placeholder">
                <Icon icon="material-symbols:image" />
                <span>No image selected</span>
              </div>
              <button
                v-if="imagePreview"
                type="button"
                class="remove-image"
                @click="removeImage"
              >
                <Icon icon="material-symbols:delete" />
              </button>
            </div>

            <div class="upload-actions">
              <label for="imageUpload" class="upload-button">
                <Icon icon="material-symbols:upload" />
                <span>Select Image</span>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                @change="onImageSelect"
                class="file-input"
              />
              <p class="upload-hint">
                Recommended size: 800x400px. Max size: 2MB.
              </p>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" @click="closeModal">
            Cancel
          </button>
          <button type="submit" class="submit-button">
            {{ editMode ? 'Save Changes' : 'Add Branch' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';

// Check if in development mode (hardcoded for now)
const isDevelopment = ref(true); // This can be toggled to hide/show debug features

// Define props and emits
const props = defineProps({
  isOpen: Boolean,
  branch: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'branch-added', 'branch-updated']);

// Form data initialization
const defaultFormData = {
  name: '',
  type: '',
  branchCode: '',
  manager: '',
  email: '',
  phone: '',
  hours: '',
  addressLine1: '',
  addressLine2: '',
  subdistrict: '',
  district: '',
  province: '',
  postalCode: '',
  status: 'active',
  locationId: '000000000000000000000000', // Placeholder, to be replaced with actual location ID
  businessHours: [
    { day: 0, open: '10:00', close: '22:00', isClosed: false }, // Sunday
    { day: 1, open: '10:00', close: '22:00', isClosed: false }, // Monday
    { day: 2, open: '10:00', close: '22:00', isClosed: false }, // Tuesday
    { day: 3, open: '10:00', close: '22:00', isClosed: false }, // Wednesday
    { day: 4, open: '10:00', close: '22:00', isClosed: false }, // Thursday
    { day: 5, open: '10:00', close: '22:00', isClosed: false }, // Friday
    { day: 6, open: '10:00', close: '22:00', isClosed: false }, // Saturday
  ],
};

const formData = ref({ ...defaultFormData });
const submitted = ref(false);
const imageFile = ref(null);
const imagePreview = ref(null);

// Calculate if we're editing an existing branch
const editMode = computed(() => !!props.branch);

// Watch for branch prop changes to update form data
watch(
  () => props.branch,
  newBranch => {
    if (newBranch) {
      formData.value = { ...newBranch };
      imagePreview.value = newBranch.image || null;
    }
  },
  { immediate: true }
);

// Email validation
const isValidEmail = computed(() => {
  if (!formData.value.email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formData.value.email);
});

// Postal code validation
const isValidPostalCode = computed(() => {
  if (!formData.value.postalCode) return false;
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(formData.value.postalCode);
});

// Business hours validation
const isHoursValid = dayHours => {
  if (dayHours.isClosed) return true;
  return dayHours.open && dayHours.close && dayHours.open < dayHours.close;
};

const areBusinessHoursValid = computed(() => {
  if (
    !formData.value.businessHours ||
    !Array.isArray(formData.value.businessHours)
  ) {
    return false;
  }

  return formData.value.businessHours.every(day => {
    if (day.isClosed) return true;
    return day.open && day.close && day.open < day.close;
  });
});

// Helper to get day name
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

// Validate hours when toggling closed state
const validateHours = dayHours => {
  if (dayHours.isClosed) {
    // If closed, reset the hours
    dayHours.open = '';
    dayHours.close = '';
  } else {
    // If opened and hours are empty, set default
    if (!dayHours.open) dayHours.open = '10:00';
    if (!dayHours.close) dayHours.close = '22:00';
  }
};

// Handle image selection
const onImageSelect = event => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('File size should not exceed 2MB.');
    return;
  }

  // Create image preview
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

// Remove selected image
const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;

  // Reset the file input
  const fileInput = document.getElementById('imageUpload');
  if (fileInput) fileInput.value = '';
};

// Submit form handler
const submitForm = () => {
  submitted.value = true;

  // Validate required fields
  if (
    !formData.value.name ||
    !formData.value.type ||
    !formData.value.branchCode ||
    !formData.value.manager ||
    !formData.value.email ||
    !formData.value.phone ||
    !formData.value.addressLine1 ||
    !formData.value.district ||
    !formData.value.subdistrict ||
    !formData.value.province ||
    !formData.value.postalCode ||
    !formData.value.status ||
    !isValidEmail.value ||
    !isValidPostalCode.value ||
    !areBusinessHoursValid.value
  ) {
    return;
  }

  // Construct a full address for display in the branch card
  const fullAddress = [
    formData.value.addressLine1,
    formData.value.addressLine2,
    formData.value.subdistrict,
    formData.value.district,
    formData.value.province,
    formData.value.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  // Create branch data object
  const branchData = {
    ...formData.value,
    branchName: formData.value.name,
    branchManager: formData.value.manager,
    contactPhone: formData.value.phone,
    contactEmail: formData.value.email,
    address: fullAddress, // Include full address for display
    image: imagePreview.value,
  };

  // Emit appropriate event based on mode
  if (editMode.value) {
    emit('branch-updated', branchData);
  } else {
    emit('branch-added', branchData);
  }

  // Close modal and reset form
  closeModal();
};

// Prefill form with test data (for development)
const prefillTestData = () => {
  formData.value = {
    name: 'KFC Siam Square',
    branchCode: 'BKK001',
    type: 'main',
    manager: 'Somchai Jaidee',
    email: 'siamsquare@kfcthailand.com',
    phone: '+6622345680',
    addressLine1: '989 Rama I Rd',
    addressLine2: 'Siam Square',
    subdistrict: 'Pathum Wan',
    district: 'Pathum Wan',
    province: 'Bangkok',
    postalCode: '10330',
    status: 'active',
    locationId: '000000000000000000000000', // Will be replaced after location creation
    businessHours: [
      { day: 0, open: '10:00', close: '22:00', isClosed: false }, // Sunday
      { day: 1, open: '10:00', close: '22:00', isClosed: false }, // Monday
      { day: 2, open: '10:00', close: '22:00', isClosed: false }, // Tuesday
      { day: 3, open: '10:00', close: '22:00', isClosed: false }, // Wednesday
      { day: 4, open: '10:00', close: '22:00', isClosed: false }, // Thursday
      { day: 5, open: '10:00', close: '23:00', isClosed: false }, // Friday
      { day: 6, open: '10:00', close: '23:00', isClosed: false }, // Saturday
    ],
    hours: '10:00 AM - 10:00 PM',
  };
};

// Close modal and reset form
const closeModal = () => {
  submitted.value = false;
  formData.value = { ...defaultFormData };
  imageFile.value = null;
  imagePreview.value = null;
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 750px;
  max-height: 90vh;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-button:hover {
  color: #555;
}

.branch-form {
  padding: 20px 24px;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #6b9080;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1;
  min-width: 0; /* Allows flex items to shrink below content width */
}

.form-group.full-width {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  background-color: #f9f9f9;
}

.form-input:focus {
  outline: none;
  border-color: #6b9080;
  background-color: #fff;
}

.form-input::placeholder {
  color: #aaa;
}

.input-error {
  border-color: #e57373 !important;
}

.error-text {
  color: #e57373;
  font-size: 12px;
  display: block;
  margin-top: 4px;
}

/* Image upload styling */
.image-upload-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.image-preview {
  width: 240px;
  height: 140px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.image-preview.has-image {
  border: none;
  background-size: cover;
  background-position: center;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #aaa;
}

.upload-placeholder svg {
  font-size: 32px;
  margin-bottom: 8px;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-image:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.upload-actions {
  flex: 1;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f0f7f4;
  color: #6b9080;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #e0efe8;
  transition: background-color 0.2s;
}

.upload-button:hover {
  background-color: #e0efe8;
}

.file-input {
  display: none;
}

.upload-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #888;
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

.time-inputs.disabled {
  opacity: 0.5;
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

/* Checkbox styling */
.checkbox-container {
  display: inline-flex;
  align-items: center;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  color: #555;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #e8e8e8;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #6b9080;
  border-color: #6b9080;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}

.cancel-button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background-color: white;
  color: #555;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #f5f5f5;
}

.submit-button {
  padding: 10px 24px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #5a7b6c;
}

/* Debug section styles */
.debug-section {
  background-color: #f8f9fa;
  border: 1px dashed #dc3545;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
}

.debug-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.debug-button:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 16px;
  }

  .image-upload-container {
    flex-direction: column;
    align-items: center;
  }

  .image-preview {
    width: 100%;
    max-width: 320px;
  }
}
</style>
