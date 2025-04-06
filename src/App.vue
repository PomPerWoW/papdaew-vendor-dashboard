<script setup>
import { RouterView } from 'vue-router';
import SideBarVendor from './components/SideBarVendor.vue';
import SideBarAdmin from './components/SideBarAdmin.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from './stores/counter.js';

const route = useRoute();
const userStore = useUserStore();

const userRole = computed(() => userStore.role);

// Determine if the sidebar should be hidden
const hideSidebarVendor = computed(
  () => route.meta.hideSidebarVendor || userRole.value !== 'vendor'
);
const hideSidebarAdmin = computed(
  () => route.meta.hideSidebarAdmin || userRole.value !== 'admin'
);
</script>

<template>
  <div class="app-container">
    <SideBarVendor
      v-if="userRole === 'vendor' && !route.meta.hideSidebarVendor"
    />
    <SideBarAdmin v-if="userRole === 'admin' && !route.meta.hideSidebarAdmin" />
    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.app-container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f9fafb;
  /* padding: 20px; */
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    /* padding-right: calc(var(--section-gap) / 2); */
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
