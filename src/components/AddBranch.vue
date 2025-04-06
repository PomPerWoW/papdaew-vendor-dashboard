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

          <div class="form-group full-width">
            <label for="address">Address*</label>
            <textarea
              id="address"
              v-model="formData.address"
              rows="3"
              class="form-input"
              :class="{ 'input-error': submitted && !formData.address }"
              placeholder="Enter branch address"
            ></textarea>
            <small v-if="submitted && !formData.address" class="error-text">
              Address is required
            </small>
          </div>
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
  manager: '',
  email: '',
  phone: '',
  hours: '',
  address: '',
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
    !formData.value.manager ||
    !formData.value.email ||
    !formData.value.phone ||
    !formData.value.hours ||
    !formData.value.address ||
    !isValidEmail.value
  ) {
    return;
  }

  // Create branch data object
  const branchData = {
    ...formData.value,
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
