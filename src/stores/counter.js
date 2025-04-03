import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const role = ref('admin'); // Mock role: 'vendor' or 'admin'

  function setRole(newRole) {
    role.value = newRole;
  }

  return { role, setRole };
});