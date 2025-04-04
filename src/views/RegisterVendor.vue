<template>
  <div class="container1">
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const form = ref({
  name: '',
  email: '',
  password: '',
  copy_number: '',
  branch: '',
  phone: '',
  Manager: '',
  ManagerPhone: '',
  address: '',
});


const selectedImage = ref(null)
const imageName = ref(null)
const selectedFile = ref(null)
const fileName = ref(null)

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

  if (selectedFile.value) {
    formData.append('file', selectedFile.value)
  }

  try {
    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    console.log('Upload successful:', response.data)
    alert('Form submitted successfully!')
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Failed to submit the form.')
  }
}
</script>

<style>
.container1 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
}

.form-container {
  width: 600px;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
}

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
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.button1:hover {
  background-color: #4d695d;
}

.images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.images-lists {
  position: relative;
  margin-right: 10px;
}

.image-container {
  padding: 4px;
  border: 0.5px solid #a0a0a0;
  border-radius: 10px;
  position: relative;
}

.image-style {
  height: 100px;
  width: 100px;
  object-fit: cover;
}

.cross-icon {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  background-color: white;
  padding: 2px 5px;
  border-radius: 50%;
}
</style>
