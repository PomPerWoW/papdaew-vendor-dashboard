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
import QueueVendor from '@/views/QueueVendor.vue';
import Login from '@/views/Login.vue';
import UnauthorizedAccess from '@/views/UnauthorizedAccess.vue';
import Signup from '@/views/Signup.vue';
import BranchStaffSignup from '@/views/BranchStaffSignup.vue';
import { verifyAuth, getCurrentUser } from '../lib/api.js';
import BranchRatings from '@/views/BranchRatings.vue';
import AllQueuesView from '@/views/AllQueuesView.vue';

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
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        hideSidebar: true,
      },
    },
    {
      path: '/branch-staff-signup',
      name: 'branch-staff-signup',
      component: BranchStaffSignup,
      meta: {
        hideSidebar: true,
        role: 'vendor',
        requiresRootAccount: true, // Only root accounts can create branch staff
      },
    },
    {
      path: '/branch',
      name: 'branch',
      component: BranchVendor,
      meta: {
        role: 'vendor',
        requiresRootAccount: true, // Only root accounts can manage branches
      },
    },
    {
      path: '/branch-ratings',
      name: 'branch-ratings',
      component: BranchRatings,
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
      path: '/queue-vendor',
      name: 'queue',
      component: QueueVendor,
      meta: {
        requiredRole: 'STAFF',
        requiresBranchStaff: true, // Only branch staff can manage queues
        requiresNonRootStaff: true, // Root accounts cannot manage queues
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        hideSidebar: true,
      },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: UnauthorizedAccess,
      meta: {
        hideSidebar: true,
      },
    },
    {
      path: '/all-queues',
      name: 'all-queues',
      component: AllQueuesView,
      meta: { role: 'vendor' },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const isLoginPage = to.path === '/login';
  const isSignupPage = to.path === '/signup';
  const isRegisterPage = to.path === '/register';
  const isForbiddenPage = to.path === '/forbidden';

  // Public routes that don't require authentication
  const isPublicRoute =
    isLoginPage || isSignupPage || isRegisterPage || isForbiddenPage;

  // For login and register pages, we skip authentication verification
  // This prevents unnecessary API calls to /users/me on these pages
  if (isLoginPage || isRegisterPage || isSignupPage) {
    console.log('Skipping auth check for public auth page:', to.path);
    next();
    return;
  }

  // For protected routes, verify authentication
  if (!isPublicRoute) {
    try {
      const isAuthenticated = await verifyAuth();

      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        userStore.clearUser();
        next('/login');
        return;
      }

      // If authenticated but user data is not in store, fetch it
      if (isAuthenticated && !userStore.user) {
        try {
          const userData = await getCurrentUser();
          userStore.setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          next('/login');
          return;
        }
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      userStore.clearUser();
      next('/login');
      return;
    }
  }

  // Check route requirements for root account or branch staff
  if (to.meta.requiresRootAccount && !userStore.isRootAccount) {
    next('/forbidden');
    return;
  }

  if (to.meta.requiresBranchStaff && !userStore.isStaff) {
    next('/forbidden');
    return;
  }

  // Check if the route requires non-root staff access
  if (to.meta.requiresNonRootStaff && userStore.isRootAccount) {
    next('/forbidden');
    return;
  }

  // If route requires a specific role
  if (to.meta.requiredRole && to.meta.requiredRole !== userStore.role) {
    next('/forbidden');
    return;
  }

  // Allow access
  next();
});

export default router;
