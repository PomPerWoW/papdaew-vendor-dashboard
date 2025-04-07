import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  // User data state
  const user = ref(null);
  const isAuthenticated = ref(false);
  const role = ref(''); // Store the specific role of the user (e.g., 'STAFF', 'ADMIN', 'MANAGER')
  const isRootAccount = ref(false); // Whether user is a root vendor account
  const branchId = ref(null); // Branch ID for branch staff

  // Computed properties
  const isStaff = computed(() => {
    return role.value === 'STAFF';
  });

  const canAccessQueue = computed(() => {
    // Only branch staff (non-root) can access queue management
    return (
      isAuthenticated.value &&
      isStaff.value &&
      branchId.value &&
      !isRootAccount.value
    );
  });

  const canAccessAnalytics = computed(() => {
    // All authenticated vendor users can access analytics
    return isAuthenticated.value;
  });

  // Actions
  function setUser(userData) {
    user.value = userData;
    isAuthenticated.value = true;

    // Set role
    role.value = userData.data.role || '';

    // Set whether this is a root vendor account
    isRootAccount.value = userData.data.staff.isRoot || false;

    // Set branch ID if applicable (for branch staff)
    branchId.value = userData.data.staff.branchId || null;
  }

  function clearUser() {
    user.value = null;
    isAuthenticated.value = false;
    role.value = '';
    isRootAccount.value = false;
    branchId.value = null;
  }

  return {
    user,
    isAuthenticated,
    role,
    isStaff,
    isRootAccount,
    branchId,
    canAccessQueue,
    canAccessAnalytics,
    setUser,
    clearUser,
  };
});
