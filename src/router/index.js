import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/counter.js';
import HomeView from '../views/HomeView.vue';
import RegisterVendor from '../views/RegisterVendor.vue';
import BranchVendor from '../views/BranchVendor.vue';
import CustomerVendor from '../views/CustomerVendor.vue';
import VendorDashboard from '../views/VendorDashboard.vue';
import HelpVendor from '@/views/HelpVendor.vue';
import SettingVendor from '@/views/SettingVendor.vue';
import SupportVendor from '@/views/SupportVendor.vue';
import Login from '@/views/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard-vendor',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterVendor,
      meta: {
        hideSidebar: true,
      },
    },
    {
      path: '/branch',
      name: 'branch',
      component: BranchVendor,
      meta: { role: 'vendor' },
    },
    {
      path: '/customer-vendor',
      name: 'customer',
      component: CustomerVendor,
      meta: { role: 'vendor' },
    },
    {
      path: '/dashboard-vendor',
      name: 'dashboard',
      component: VendorDashboard,
      meta: { role: 'vendor' },
    },
    {
      path: '/help-vendor',
      name: 'help',
      component: HelpVendor,
      meta: { role: 'vendor' },
    },
    {
      path: '/support',
      name: 'support',
      component: SupportVendor,
      meta: { role: 'vendor' },
    },
    {
      path: '/setting-vendor',
      name: 'setting-vendor',
      component: SettingVendor,
      meta: { role: 'vendor' },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        hideSidebar: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const userRole = userStore.role;

  // If route requires a specific role and the user doesn't have it
  if (to.meta.role && to.meta.role !== userRole) {
    next('/'); // Redirect to home
  } else {
    next(); // Allow access
  }
});

export default router;
