<template>
  <div class="unauthorized-container">
    <div class="unauthorized-card">
      <div class="icon">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#e74c3c"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15 9L9 15"
            stroke="#e74c3c"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 9L15 15"
            stroke="#e74c3c"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h1>Access Forbidden</h1>
      <p>
        You don't have permission to access this page. Your invitation token is
        invalid or has expired.
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue';

// Define the component with a multi-word name
defineComponent({
  name: 'UnauthorizedAccess',
});
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
}

.unauthorized-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #5a7b6c;
}

.btn-secondary {
  background-color: white;
  color: #6b9080;
  border: 1px solid #6b9080;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #f0f7f4;
}

@media (max-width: 576px) {
  .unauthorized-card {
    padding: 2rem;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
