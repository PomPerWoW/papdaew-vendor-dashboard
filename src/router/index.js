import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterVendor from '../views/RegisterVendor.vue';
import QueueVendor from '../views/QueueVendor.vue';

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
      meta: { hideSidebar: true },
    },
    {
      path: '/queue-vendor',
      name: 'queue-vendor',
      component: QueueVendor,
    }
  ],
});

export default router;
