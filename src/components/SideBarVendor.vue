<template>
  <aside class="sidebar" v-if="!loading">
    <div class="logo">
      <img :src="logoURL" alt="Papdaew" />
    </div>

    <h3>Vendor Management System</h3>
    <div v-if="userStore.branchId" class="branch-info">
      <span class="branch-name">{{ branchName }}</span>
      <span class="staff-badge">Staff</span>
    </div>
    <hr />
    <div class="menu">
      <router-link
        to="/dashboard-vendor"
        class="button"
        active-class="active"
        exact-active-class="active"
      >
        <Icon
          icon="material-symbols:dashboard-rounded"
          class="material-icons"
        />
        <span class="text">Dashboard</span>
      </router-link>

      <router-link
        to="/customer-vendor"
        class="button"
        active-class="active"
        exact-active-class="active"
      >
        <Icon icon="garden:customer-lists-fill-26" class="material-icons" />
        <span class="text">Customer</span>
      </router-link>

      <!-- Branches - Only for root accounts -->
      <router-link
        v-if="userStore.isRootAccount"
        to="/branch"
        class="button"
        active-class="active"
        exact-active-class="active"
      >
        <Icon icon="jam:branch" class="material-icons" />
        <span class="text">Branches</span>
      </router-link>

      <router-link
        to="/branch-ratings"
        class="button"
        active-class="active"
        exact-active-class="active"
      >
        <Icon icon="material-symbols:star" class="material-icons" />
        <span class="text">Ratings</span>
      </router-link>

      <router-link
        to="/support"
        class="button"
        active-class="active"
        exact-active-class="active"
      >
        <Icon
          icon="material-symbols:support-agent-rounded"
          class="material-icons"
        />
        <span class="text">Support</span>
      </router-link>
    </div>

    <!-- Queue Management Section - Only for branch staff (non-root) -->
    <div
      v-if="userStore.isStaff && userStore.branchId && !userStore.isRootAccount"
    >
      <hr />
      <h3>Queue Management</h3>
      <div class="menu">
        <router-link
          to="/queue-vendor"
          class="button"
          active-class="active"
          exact-active-class="active"
        >
          <Icon
            icon="material-symbols:format-list-numbered"
            class="material-icons"
          />
          <span class="text">Manage Queue</span>
        </router-link>

        <router-link
          to="/all-queues"
          class="button"
          active-class="active"
          exact-active-class="active"
        >
          <Icon icon="material-symbols:view-list" class="material-icons" />
          <span class="text">All Queues</span>
        </router-link>
      </div>
    </div>

    <hr />

    <div class="menu">
      <router-link
        to="/setting-vendor"
        class="button"
        active-class="active"
        exact-active-class="active"
      >
        <Icon icon="weui:setting-filled" class="material-icons" />
        <span class="text">Settings</span>
      </router-link>
      <router-link
        to="/help-vendor"
        class="button"
        active-class="active"
        exact-active-class="active"
      >
        <Icon icon="material-symbols:help" class="material-icons" />
        <span class="text">Help</span>
      </router-link>
    </div>
    <div class="menu-end">
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{
            userStore.isRootAccount ? 'Root Account' : 'Branch Staff'
          }}</span>
        </div>
      </div>
      <button class="button logout" @click="showLogoutConfirm">
        <Icon icon="tabler:logout-2" class="material-icons" />
        <span class="text">Logout</span>
      </button>
    </div>
  </aside>

  <!-- Loading state while userStore is being loaded -->
  <aside v-else class="sidebar sidebar-loading">
    <div class="logo">
      <img :src="logoURL" alt="Papdaew" />
    </div>
    <div class="loading-spinner"></div>
    <p class="loading-text">Loading...</p>
  </aside>

  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutModal" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Confirm Logout</h3>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to logout from your account?</p>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="cancelLogout">Cancel</button>
        <button class="confirm-button" @click="confirmLogout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import logoURL from '../assets/logo.png';
import { Icon } from '@iconify/vue';
import { logout, getCurrentUser, getBranchById } from '../lib/api';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '../stores/counter';

const router = useRouter();
const $toast = useToast();
const showLogoutModal = ref(false);
const userStore = useUserStore();
const branchName = ref('');
const loading = ref(true);

// Get user display name and initials
const userName = computed(() => {
  if (userStore.user) {
    return userStore.user.data.username || 'Vendor User';
  }
  return 'Vendor User';
});

const userInitials = computed(() => {
  if (userName.value) {
    const names = userName.value.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }
  return 'VU';
});

// Watch userStore to determine when it's fully loaded
watch(
  () => userStore.isAuthenticated,
  isAuthenticated => {
    if (isAuthenticated && userStore.user) {
      loading.value = false;
    }
  }
);

onMounted(async () => {
  try {
    // If user data is not already in store, try to fetch it
    if (!userStore.user) {
      const userData = await getCurrentUser();
      userStore.setUser(userData);
    }

    // If we have the user data now, set loading to false
    if (userStore.user) {
      loading.value = false;
    }

    if (userStore.branchId) {
      // In a real app, fetch the branch name if not available in user object
      // For example, you might want to fetch branch details from an API
      try {
        // Here you would fetch branch details using the branchId
        const branchDetails = await getBranchById(
          userStore.user.data.staff.vendorId,
          userStore.user.data.staff.branchId
        );
        console.log(branchDetails.data);
        branchName.value = branchDetails.data.branchName;

        // For now, we'll use a placeholder
        branchName.value = branchDetails.data.branchName;
      } catch (error) {
        console.error('Error fetching branch details:', error);
        branchName.value = 'Branch #' + userStore.branchId;
      }
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    loading.value = false;
  }
});

const showLogoutConfirm = () => {
  showLogoutModal.value = true;
};

const cancelLogout = () => {
  showLogoutModal.value = false;
};

const confirmLogout = async () => {
  showLogoutModal.value = false;

  try {
    await logout();

    // Clear user data from store
    userStore.clearUser();

    $toast.success('You have been logged out successfully', {
      position: 'top-right',
      duration: 3000,
    });

    // Now manually navigate to login
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);

    $toast.error('There was an issue logging out. Please try again.', {
      position: 'top-right',
      duration: 3000,
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  color: #fff;
  width: 280px;
  height: 100vh;
  padding: 20px 0;
  align-items: center;
  background-color: white;
  border-right: 1px solid #e6e6e6;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.03);
}

.text {
  font-size: 16px;
  font-weight: 500;
  width: auto;
  color: #555555;
  transition: all 0.2s ease;
}

.logo {
  margin-bottom: 24px;
  align-self: center;
  padding: 0 20px;
}

.logo img {
  width: 140px;
}

h3 {
  color: #9e9e9e;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1px;
  margin-bottom: 8px;
  text-transform: uppercase;
  padding: 0 24px;
  width: 100%;
}

.branch-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  margin-top: 8px;
  background-color: #f0f7f4;
  border-radius: 4px;
}

.branch-name {
  font-size: 14px;
  font-weight: 500;
  color: #6b9080;
}

.staff-badge {
  margin-left: 8px;
  padding: 2px 6px;
  background-color: #6b9080;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.menu {
  margin: 0;
  width: 100%;
  padding: 0;
}

.menu-end {
  margin-top: auto;
  width: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #eeeeee;
  margin-bottom: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f7f4;
  color: #6b9080;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  margin-right: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.user-role {
  font-size: 12px;
  color: #666;
}

hr {
  width: 85%;
  border: none;
  border-top: 1px solid #eeeeee;
  margin: 16px 0;
}

.button {
  display: flex;
  align-items: center;
  text-decoration: none;
  width: 100%;
  padding: 12px 24px;
  margin-bottom: 4px;
  border-radius: 0 8px 8px 0;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  position: relative;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}

.button:hover {
  background-color: #f5f9f7;
}

.button:hover .text {
  color: #6b9080;
}

.button.active {
  background-color: #f0f7f4;
  border-left: 3px solid #6b9080;
}

.button.active .material-icons,
.button.active .text {
  color: #6b9080;
}

.button .material-icons {
  font-size: 22px;
  margin-right: 14px;
  color: #a4c3b2;
  transition: all 0.2s ease;
}

.button.logout {
  margin-bottom: 20px;
}

.button.logout:hover {
  background-color: #fff2f2;
}

.button.logout:hover .material-icons,
.button.logout:hover .text {
  color: #e57373;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  text-align: left;
  letter-spacing: normal;
  text-transform: none;
  padding: 0;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0;
  color: #555;
  font-size: 16px;
}

.modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
}

button {
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #555;
}

.cancel-button:hover {
  background-color: #e9e9e9;
}

.confirm-button {
  background-color: #e57373;
  color: white;
}

.confirm-button:hover {
  background-color: #d32f2f;
}

@media (max-width: 1024px) {
  .sidebar {
    position: absolute;
    z-index: 99;
    width: 260px;
  }

  .button {
    padding: 10px 20px;
  }
}

/* Add styles for loading state */
.sidebar-loading {
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(107, 144, 128, 0.2);
  border-radius: 50%;
  border-top-color: #6b9080;
  animation: spin 1s linear infinite;
  margin: 40px 0;
}

.loading-text {
  color: #6b9080;
  font-size: 14px;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
