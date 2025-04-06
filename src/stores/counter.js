import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const role = ref('vendor'); // Default role is vendor

  function setRole(newRole) {
    if (newRole !== 'vendor') {
      console.warn('This dashboard only supports vendor role');
      return;
    }
    role.value = newRole;
  }

  return { role, setRole };
});
