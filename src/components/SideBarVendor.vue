<template>
  <aside class="sidebar">
    <div class="logo">
      <img :src="logoURL" alt="Papdaew" />
    </div>

    <h3>Vendor Management System</h3>
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
      <router-link
        to="/branch"
        class="button"
        active-class="active"
        exact-active-class="active"
      >
        <Icon icon="jam:branch" class="material-icons" />
        <span class="text">Branches</span>
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
      <router-link to="/login" class="button logout">
        <Icon icon="tabler:logout-2" class="material-icons" />
        <span class="text">Logout</span>
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
  font-size: 12px;
  letter-spacing: 1px;
  margin-bottom: 8px;
  text-transform: uppercase;
  padding: 0 24px;
  width: 100%;
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
</style>
