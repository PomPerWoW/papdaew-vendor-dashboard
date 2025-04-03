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
            <InputText v-model="form.password" type="text" variant="filled" />

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

        <label for="image">Upload Image :</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          @change="handleFileUpload"
          multiple
        />

        <div class="images">
          <div
            v-for="(src, index) in imageSrc"
            :key="index"
            class="images-lists"
          >
            <div class="image-container">
              <img :src="src" class="image-style" />
            </div>
            <div class="cross-icon" @click="removeItem(index)">
              <img src="./assets/cancel.svg" />
            </div>
            <p class="line-clamp-1 text-center">
              {{ selectedFiles[index].name }}
            </p>
          </div>
        </div>

        <button type="submit" class="button1">Register</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
}
</style>
