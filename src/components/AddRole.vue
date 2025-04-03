<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>Add Role</h2>

      <form @submit.prevent="submitForm">
        <div class="">
          <div>
            <label>Name:</label>
            <InputText v-model="formData.name" type="text" variant="filled" />
          </div>
        </div>
        <div class="">
          <div style="display: flex; flex-direction: column">
            <label>Role:</label>
            <MultiSelect
              v-model="selectedCities"
              :options="cities"
              optionLabel="role"
              filter
              placeholder="Select Roles"
              :maxSelectedLabels="3"
            />
          </div>
        </div>

        <div class="button-container">
          <button type="button" @click="emit('close')" class="form-btn">
            Cancel
          </button>
          <button type="submit" class="form-btn">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close']);

const formData = ref({
  managerName: '',

});

const uploadedFile = ref(null);
const handleFileUpload = event => {
  uploadedFile.value = event.target.files[0];
};

const submitForm = () => {
  console.log('Submitted Data:', formData.value);
  emit('close');
};

const selectedCities = ref();
const cities = ref([{ role: 'Vendor' }, { role: 'admin' }]);
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
  background: #6b9080;
  color: white;
}
</style>
