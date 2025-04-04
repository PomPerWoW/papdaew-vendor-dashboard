<template>
  <div class="container1">
    <div class="illustration">
      <!-- <img src="/path-to-your-illustration.png" alt="Illustration" /> -->
    </div>
    <div class="form-container">
      <div class="logo-head">
        <div style="justify-content: center; display: flex">
          <img :src="logoURL" alt="Vue" style="width: 150px" />
        </div>
        <h2 style="display: flex; justify-content: start; font-weight: 500; margin-top: 1rem;">Login</h2>
      </div>

      <form @submit.prevent="submitForm">
        <label for="email">Email :</label>
        <InputText v-model="form.email" type="text" variant="filled" />

        <label for="password">Password :</label>
        <InputText v-model="form.password" type="text" variant="filled" />

        <button type="submit" class="button1">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import logoURL from '../assets/logo.png';
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
  images: [],
});

const imageSrc = ref([]);
const selectedFiles = ref([]);

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

const submitForm = () => {
  console.log('Form Data:', form.value);
  console.log('Uploaded Files:', selectedFiles.value);
  alert('Form submitted successf  ully!');
};
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

input {
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
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

.cross-icon {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
.logo-head {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
