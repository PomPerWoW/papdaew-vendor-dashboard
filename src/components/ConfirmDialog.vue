<template>
  <div v-if="modelValue" class="confirm-dialog-overlay">
    <div class="confirm-dialog">
      <div class="dialog-header">
        <Icon icon="material-symbols:warning" class="warning-icon" />
        <h3>Confirm Action</h3>
      </div>

      <div class="dialog-content">
        <p>{{ message || 'Are you sure you want to perform this action?' }}</p>
      </div>

      <div class="dialog-actions">
        <button class="cancel-btn" @click="cancel">Cancel</button>
        <button class="confirm-btn" @click="confirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';

// Define props
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
});

// Define emits
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};

const cancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.confirm-dialog {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: dialogFadeIn 0.2s ease-out;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.warning-icon {
  font-size: 24px;
  color: #f6bd60;
  margin-right: 12px;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dialog-content {
  padding: 24px;
}

.dialog-content p {
  margin: 0;
  color: #555;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  gap: 12px;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #555;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.confirm-btn {
  background-color: #e57373;
  color: white;
}

.confirm-btn:hover {
  background-color: #ef5350;
}
</style>
