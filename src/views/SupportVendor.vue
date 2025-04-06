<template>
  <div class="support-page">
    <div class="support-container">
      <div class="page-header">
        <h1>Support Center</h1>
        <p>Get help with your vendor account and services</p>
      </div>

      <div class="content-grid">
        <!-- Support Form Section -->
        <div class="form-section card">
          <h2>Contact Support</h2>
          <p>
            Fill out this form and our team will get back to you as soon as
            possible.
          </p>

          <form @submit.prevent="submitSupportRequest" class="support-form">
            <div class="form-group">
              <label for="subject">Subject*</label>
              <input
                id="subject"
                v-model="supportForm.subject"
                type="text"
                class="form-input"
                :class="{ 'input-error': submitted && !supportForm.subject }"
                placeholder="Enter the subject of your inquiry"
              />
              <small
                v-if="submitted && !supportForm.subject"
                class="error-text"
              >
                Subject is required
              </small>
            </div>

            <div class="form-group">
              <label for="category">Category*</label>
              <select
                id="category"
                v-model="supportForm.category"
                class="form-input"
                :class="{ 'input-error': submitted && !supportForm.category }"
              >
                <option value="" disabled selected>Select a category</option>
                <option value="account">Account Issues</option>
                <option value="orders">Orders & Delivery</option>
                <option value="payment">Payment Issues</option>
                <option value="technical">Technical Support</option>
                <option value="other">Other</option>
              </select>
              <small
                v-if="submitted && !supportForm.category"
                class="error-text"
              >
                Category is required
              </small>
            </div>

            <div class="form-group">
              <label for="message">Message*</label>
              <textarea
                id="message"
                v-model="supportForm.message"
                rows="6"
                class="form-input"
                :class="{ 'input-error': submitted && !supportForm.message }"
                placeholder="Describe your issue in detail"
              ></textarea>
              <small
                v-if="submitted && !supportForm.message"
                class="error-text"
              >
                Message is required
              </small>
            </div>

            <div class="form-group attachment-section">
              <label
                >Attachments <span class="optional">(Optional)</span></label
              >
              <div class="attachment-container">
                <label for="file-upload" class="attachment-button">
                  <Icon icon="material-symbols:upload-file-outline" />
                  <span>Add Attachment</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  @change="handleFileUpload"
                  multiple
                  class="file-input"
                />
                <small class="hint-text"
                  >Max 3 files, 5MB each (Images or PDF only)</small
                >
              </div>

              <div v-if="attachments.length > 0" class="attachment-list">
                <div
                  v-for="(file, index) in attachments"
                  :key="index"
                  class="attachment-item"
                >
                  <div class="attachment-info">
                    <Icon :icon="getFileIcon(file.type)" />
                    <span class="file-name">{{ file.name }}</span>
                  </div>
                  <button
                    type="button"
                    class="remove-button"
                    @click="removeAttachment(index)"
                  >
                    <Icon icon="material-symbols:close" />
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" class="submit-button">
              <Icon icon="material-symbols:send" />
              <span>Submit Request</span>
            </button>
          </form>
        </div>

        <!-- Contact Information Section -->
        <div class="contact-section">
          <div class="card contact-card">
            <h2>Direct Contact</h2>
            <p>Need immediate assistance? Reach out through these channels:</p>

            <div class="contact-methods">
              <div class="contact-method">
                <div class="icon-circle">
                  <Icon icon="material-symbols:mail" />
                </div>
                <div>
                  <h3>Email Support</h3>
                  <a href="mailto:vendor-support@papdaew.com"
                    >vendor-support@papdaew.com</a
                  >
                  <p>We respond within 24 hours</p>
                </div>
              </div>

              <div class="contact-method">
                <div class="icon-circle">
                  <Icon icon="material-symbols:call" />
                </div>
                <div>
                  <h3>Phone Support</h3>
                  <a href="tel:+6622345678">+66 2 234 5678</a>
                  <p>Available Mon-Fri, 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div class="contact-method">
                <div class="icon-circle">
                  <Icon icon="mingcute:line-fill" />
                </div>
                <div>
                  <h3>Line Official</h3>
                  <a href="https://line.me/ti/p/@papdaew" target="_blank"
                    >@papdaew</a
                  >
                  <p>Chat with our support team</p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Section -->
          <div class="card faq-card">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-list">
              <div
                v-for="(faq, index) in faqs"
                :key="index"
                class="faq-item"
                :class="{ active: expandedFaq === index }"
                @click="toggleFaq(index)"
              >
                <div class="faq-question">
                  <h3>{{ faq.question }}</h3>
                  <Icon
                    :icon="
                      expandedFaq === index
                        ? 'material-symbols:expand-less'
                        : 'material-symbols:expand-more'
                    "
                  />
                </div>
                <div class="faq-answer" v-if="expandedFaq === index">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();

// Support form data
const supportForm = ref({
  subject: '',
  category: '',
  message: '',
});

const submitted = ref(false);
const attachments = ref([]);
const expandedFaq = ref(0); // Default expand first FAQ

// FAQ data
const faqs = [
  {
    question: 'How do I reset my password?',
    answer:
      'You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password.',
  },
  {
    question: 'How can I update my business information?',
    answer:
      'Go to the Dashboard and click on the "Profile" section. There you can edit all your business details including contact information, operating hours, and business description.',
  },
  {
    question: 'How long does it take to process a withdrawal?',
    answer:
      "Withdrawal requests are typically processed within 1-3 business days. The time it takes for the funds to appear in your bank account depends on your bank's processing time.",
  },
  {
    question: 'How do I add a new branch location?',
    answer:
      'You can add a new branch by navigating to the "Branches" section and clicking on the "Add Branch" button. Fill in the required information and submit the form.',
  },
  {
    question: 'What commission rates does Papdaew charge?',
    answer:
      'Commission rates vary by category and are outlined in your vendor agreement. You can view your specific rates in the "Finance" section of your dashboard.',
  },
];

// Toggle FAQ expand/collapse
const toggleFaq = index => {
  expandedFaq.value = expandedFaq.value === index ? null : index;
};

// Handle file uploads
const handleFileUpload = event => {
  const files = event.target.files;

  if (!files || files.length === 0) return;

  // Validate file count
  if (attachments.value.length + files.length > 3) {
    $toast.error('Maximum 3 files allowed');
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      $toast.error(`File ${file.name} exceeds the 5MB limit`);
      continue;
    }

    // Validate file type
    if (!file.type.match('image.*') && file.type !== 'application/pdf') {
      $toast.error(`File ${file.name} must be an image or PDF`);
      continue;
    }

    // Add file to attachments
    attachments.value.push(file);
  }

  // Reset file input
  event.target.value = '';
};

// Remove attachment
const removeAttachment = index => {
  attachments.value.splice(index, 1);
};

// Get icon based on file type
const getFileIcon = fileType => {
  if (fileType.match('image.*')) {
    return 'material-symbols:image';
  } else if (fileType === 'application/pdf') {
    return 'material-symbols:picture-as-pdf';
  }
  return 'material-symbols:attach-file';
};

// Submit support request
const submitSupportRequest = () => {
  submitted.value = true;

  // Validate form
  if (
    !supportForm.value.subject ||
    !supportForm.value.category ||
    !supportForm.value.message
  ) {
    return;
  }

  // Submit the form (API call would go here)
  // For now, we'll just show a success message
  $toast.success('Your support request has been submitted successfully.');

  // Reset form
  supportForm.value = {
    subject: '',
    category: '',
    message: '',
  };
  attachments.value = [];
  submitted.value = false;
};
</script>

<style scoped>
.support-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.support-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
  font-size: 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
  height: fit-content;
}

/* Form Section */
.form-section {
  grid-column: 1;
}

.form-section h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-section > p {
  color: #666;
  margin-bottom: 24px;
}

.support-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #444;
}

.optional {
  font-weight: normal;
  color: #888;
  font-size: 14px;
}

.form-input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.2s;
  background-color: #f9f9f9;
}

.form-input:focus {
  outline: none;
  border-color: #6b9080;
  background-color: #fff;
}

.input-error {
  border-color: #e57373 !important;
}

.error-text {
  color: #e57373;
  font-size: 13px;
  margin-top: 4px;
}

.hint-text {
  color: #888;
  font-size: 13px;
  margin-top: 4px;
}

.attachment-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #f0f7f4;
  color: #6b9080;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #e0efe8;
  width: fit-content;
  transition: background-color 0.2s;
}

.attachment-button:hover {
  background-color: #e0efe8;
}

.file-input {
  display: none;
}

.attachment-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 6px;
}

.attachment-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name {
  font-size: 14px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: #eee;
  color: #666;
}

.submit-button {
  padding: 14px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s;
  margin-top: 8px;
}

.submit-button:hover {
  background-color: #5a7b6c;
}

/* Contact Section */
.contact-section {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-card h2,
.faq-card h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.contact-card > p {
  color: #666;
  margin-bottom: 24px;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-method {
  display: flex;
  gap: 16px;
  align-items: center;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f0f7f4;
  color: #6b9080;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.contact-method h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #444;
}

.contact-method a {
  text-decoration: none;
  color: #6b9080;
  font-weight: 500;
  transition: color 0.2s;
}

.contact-method a:hover {
  color: #5a7b6c;
  text-decoration: underline;
}

.contact-method p {
  margin: 4px 0 0 0;
  color: #777;
  font-size: 14px;
}

/* FAQ Section */
.faq-list {
  margin-top: 16px;
}

.faq-item {
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question h3 {
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  color: #444;
}

.faq-answer {
  padding: 0 0 16px 0;
}

.faq-answer p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.faq-item.active .faq-question h3 {
  color: #6b9080;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .form-section,
  .contact-section {
    grid-column: 1;
  }
}

@media (max-width: 600px) {
  .support-page {
    padding: 12px;
  }

  .card {
    padding: 16px;
  }

  .contact-method {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .icon-circle {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
