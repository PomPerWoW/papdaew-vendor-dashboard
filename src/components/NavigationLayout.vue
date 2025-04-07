<template>
  <div class="flex gap-2 items-center">
    <div class="text-right">
      <h4 class="text-md font-bold">
        {{ userStore.user?.name || 'Loading...' }}
      </h4>
      <p class="text-xs text-gray-700">{{ userStore.user?.role || 'Staff' }}</p>
    </div>
    <div
      class="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 text-lg font-bold"
    >
      {{
        userStore.user?.name ? userStore.user.name.charAt(0).toUpperCase() : 'U'
      }}
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/counter';

const userStore = useUserStore();
</script>
