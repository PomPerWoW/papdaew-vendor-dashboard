<script setup>
import { RouterView } from 'vue-router';
import SideBar from './components/SideBarVendor.vue';
import { Button } from '@/components/ui/button';
</script>

<template>
  <!-- <div class="app-container">
    <SideBar v-if="!$route.meta.hideSidebarVendor" />
    <div class="main-content">
      <RouterView />
    </div>
  </div> -->
  <div>
    <Button>Click me</Button>
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
