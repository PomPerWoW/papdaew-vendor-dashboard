<template>
  <aside class="sidebar">
    <div class="logo">
      <img :src="logoURL" alt="Vue" />
    </div>

    <h3>Vendor Management System</h3>
    <hr />
    <div class="menu">
      <router-link to="/dashboard-vendor" class="button">
        <!-- <span class="material-icons">home</span> -->
        <Icon icon="material-symbols:dashboard-rounded" class="material-icons"/>
        <span class="text">Dashboard</span>
      </router-link>
      <router-link to="/customer-vendor" class="button">
        <Icon icon="garden:customer-lists-fill-26" class="material-icons"/>
        <span class="text">Customer</span>
      </router-link>
      <router-link to="/contract-vendor" class="button">
        <Icon icon="jam:branch" class="material-icons"/>
        <span class="text">Contract</span>
      </router-link>
      <router-link to="/queue-vendor" class="button">
        <Icon icon="heroicons:queue-list-solid" class="material-icons"/>
        <span class="text">Queue</span>
      </router-link>
      <router-link to="/contact" class="button">
        <Icon icon="material-symbols:support-agent-rounded" class="material-icons"/>
        <span class="text">Support</span>
      </router-link>
    </div>
    <hr />
    <!-- <div class="flex"></div> -->

    <div class="menu">
      <router-link to="/contact" class="button">
        <Icon icon="weui:setting-filled" class="material-icons"/>
        <span class="text">Settings</span>
      </router-link>
      <router-link to="/contact" class="button">
        <Icon icon="material-symbols:help" class="material-icons"/>
        <span class="text">Help</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import logoURL from '../assets/logo.png';
import { Icon } from '@iconify/vue';
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  color: #fff;
  width: 350px;
  height: 100vh;
  padding: 16px;
  align-items: center;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  /* margin: 2.5rem; */
}
.text{
    font-size: 20px;
    width: auto;
    color: #555555;
    transition: background 0.2s;
}
.logo {
  margin-bottom: 16px;
  align-self: center;
}

.logo img {
  width: 150px;
}

h3 {
  color: #a0a0a0;
  font-size: 14px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.menu {
  margin: 0 -16px;
  align-content: start;
  width: 100%;
}

hr {
  width: 90%;
  border: none;
  border-top: 1px solid #dcdcdc;
  margin: 16px 0;
}

.button {
  display: flex;
  align-items: start;
  text-decoration: none;
  width: 100%;
  padding: 8px 16px;
  transition: background 0.2s;
}

.button .material-icons {
  font-size: 36px;
  margin-right: 12px;
  color: #A4C3B2;
}

.text:hover {
  color: #A4C3B2;

}

@media (max-width: 1024px) {
  .sidebar {
    position: absolute;
    z-index: 99;
  }
}
</style>
