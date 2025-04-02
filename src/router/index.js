import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterVendor from '../views/RegisterVendor.vue';
import QueueVendor from '../views/QueueVendor.vue';
import ContractVendor from '../views/ContractVendor.vue';
import CustomerVendor from '../views/CustomerVendor.vue';
import DashboardVendor from '@/views/DashboardVendor.vue';
import HelpVendor from '@/views/HelpVendor.vue';
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
      meta: { hideSidebarVendor: true },
    },
    {
      path: '/queue-vendor',
      name: 'queue-vendor',
      component: QueueVendor,
    },
    {
      path: '/contract-vendor',
      name: 'contract',
      component: ContractVendor,
    },
    {
      path: '/customer-vendor',
      name: 'customer',
      component: CustomerVendor,
    },
    {
      path: '/dashboard-vendor',
      name: 'dashboard',
      component: DashboardVendor
    },
    { 
      path: '/help-vendor',
      name: 'help',
      component: HelpVendor,
    }
  ],
});

export default router;
