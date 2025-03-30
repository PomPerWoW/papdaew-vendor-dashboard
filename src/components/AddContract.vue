<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>Add Contract</h2>

      <form @submit.prevent="submitForm">
        <div class="insideform">
          <div style="margin-right: 1.2rem; width: 205px">
            <label>Manager Name:</label>
            <input v-model="formData.managerName" type="text" />
          </div>
          <div style="width: 205px">
            <label>Email:</label>
            <input v-model="formData.email" type="email" />
          </div>
        </div>
        <div class="insideform">
          <div style="margin-right: 1.2rem; width: 205px">
            <label>Telephone Number:</label>
            <input v-model="formData.telephone" type="text" />
          </div>
          <div style="width: 205px">
            <label>Line:</label>
            <input v-model="formData.line" type="text" />
          </div>
        </div>
        <div>
          <label>Address:</label>
          <textarea v-model="formData.address"></textarea>
        </div>
        <div>
          <label>Upload your QR:</label>
          <input type="file" @change="handleFileUpload" />
        </div>
        <div class="button-container">
          <button type="button" @click="emit('close')">Cancel</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close']);

const formData = ref({
  managerName: '',
  email: '',
  line: '',
  telephone: '',
  address: '',
});

const uploadedFile = ref(null);
const handleFileUpload = event => {
  uploadedFile.value = event.target.files[0];
};

const submitForm = () => {
  console.log('Submitted Data:', formData.value);
  emit('close');
};
</script>

<style>
/* Centering the modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dark overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 450px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
.modal-content h2 {
  font-weight: 500;
}
/* Style form fields */
input,
textarea {
  width: 100%;
  padding: 8px;
  margin: 5px 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #EEEEEE;
}

.insideform {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
/* Style buttons */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-child {
  background: #ccc;
}

button:last-child {
  background: #6B9080;
  color: white;
}
</style>
