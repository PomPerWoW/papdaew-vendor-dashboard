<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>Add Contract</h2>

      <form @submit.prevent="submitForm">
        <div class="insideform">
          <div style="margin-right: 1.2rem; width: 205px">
            <label>Manager Name:</label>
            <InputText v-model="formData.name" type="text" variant="filled" />
          </div>
          <div style="width: 205px">
            <label>Email:</label>
            <InputText v-model="formData.email" type="text" variant="filled" />
          </div>
        </div>
        <div class="insideform">
          <div style="margin-right: 1.2rem; width: 205px">
            <label>Telephone Number:</label>
            <InputText v-model="formData.telephone" type="text" variant="filled" />
          </div>
          <div style="width: 205px">
            <label>Line:</label>
            <InputText v-model="formData.line" type="text" variant="filled" />
          </div>
        </div>
        <div>
          <label>Address:</label>
          <Textarea v-model="formData.address" autoResize rows="5" cols="30" />
        </div>
        <div>
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
        </div>
        <div class="button-container">
          <button type="button" @click="emit('close')" class="form-btn">Cancel</button>
          <button type="submit" class="form-btn">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close']);

const formData = ref({
  managerName: '',
  email: '',
  line: '',
  telephone: '',
  address: '',
});
const selectedImage = ref(null)
const imageName = ref(null)

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

const submitForm = () => {
  console.log('Submitted Data:', formData.value);
  if (selectedImage.value) {
    formData.append('image', selectedImage.value)
  }
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

.form-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-btn:first-child {
  background: #ccc;
}

.form-btn:last-child {
  background: #6B9080;
  color: white;
}
</style>
