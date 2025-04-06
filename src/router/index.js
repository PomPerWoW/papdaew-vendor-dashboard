import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/counter.js';
import HomeView from '../views/HomeView.vue';
import RegisterVendor from '../views/RegisterVendor.vue';
import QueueVendor from '../views/QueueVendor.vue';
import ContractVendor from '../views/ContractVendor.vue';
import CustomerVendor from '../views/CustomerVendor.vue';
import DashboardVendor from '@/views/DashboardVendor.vue';
import HelpVendor from '@/views/HelpVendor.vue';
import DashBoardAdmin from '@/views/DashBoardAdmin.vue';
import CustomerAdmin from '@/views/CustomerAdmin.vue';
import VendorlistAdmin from '@/views/VendorlistAdmin.vue';
import RoleAdmin from '@/views/RoleAdmin.vue';
import SettingVendor from '@/views/SettingVendor.vue';
import SettingAdmin from '@/views/SettingAdmin.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterVendor,
      meta: { hideSidebarVendor: true, hideSidebarAdmin: true },
    }, //vendor
    {
      path: '/queue-vendor',
      name: 'queue-vendor',
      component: QueueVendor,
      meta: { role: 'vendor' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContractVendor,
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
      component: DashboardVendor,
      meta: { role: 'vendor' },
    },
    {
      path: '/help-vendor',
      name: 'help',
      component: HelpVendor,
      meta: { role: 'vendor' },
    },
    {
      path: '/dashboard-admin',
      name: 'dashboard-admin',
      component: DashBoardAdmin,
      meta: { role: 'admin' },
    },
    {
      path: '/customer-admin',
      name: 'customer-admin',
      component: CustomerAdmin,
      meta: { role: 'admin' },
    },
    {
      path: '/vendorlist-admin',
      name: 'vendorlist-admin',
      component: VendorlistAdmin,
      meta: { role: 'admin' },
    },
    {
      path: '/role-admin',
      name: 'role-admin',
      component: RoleAdmin,
      meta: { role: 'admin' },
    },
    {
      path: '/setting-vendor',
      name: 'setting-vendor',
      component: SettingVendor,
      meta: { role: 'vendor' },
    },
    {
      path: '/setting-admin',
      name: 'setting-admin',
      component: SettingAdmin,
      meta: { role: 'admin' },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const userRole = userStore.role; // 'vendor' or 'admin'

  // If route requires a specific role
  if (to.meta.role && to.meta.role !== userRole) {
    next('/'); // Redirect to home if the role doesn't match
  } else {
    next(); // Allow access
  }
});
export default router;
