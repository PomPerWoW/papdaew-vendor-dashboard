<template>
  <div class="all" @mouseover="showQR = true" @mouseleave="showQR = false">
    <div class="content">
      <div v-if="!showQR">
        <!-- Restaurant Info -->
        <div style="display: flex">
          <Icon
            icon="icon-park-twotone:picture"
            width="50"
            height="50"
            style="border-radius: 20px"
          />
          <div class="header">
            <h3 style="font-weight: 600">Bangkok</h3>
            <p>Central World</p>
          </div>
        </div>
        <div class="body">
          <p>Location: 1 Floor</p>
          <p>Tel: 0123456789</p>
          <p>Line: @BBQCENWORLD</p>
        </div>
      </div>
        <div v-else class="qr-section content">
          <!-- QR Code Image -->
          <Icon
            icon="material-symbols:qr-code-2"
            width="100"
            height="100"
            class="qr-image"
          />
        </div>
      
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const showQR = ref(false);
</script>
<style lang="css">
.header {
  display: flex;
  flex-direction: column;
  margin-left: 1.25rem;
}
.body {
  margin-top: 1.5rem;
}
.all {
  background-color: white;
  padding: 1rem;
  border-radius: 15px;
  
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: flex-start;
}
/* QR Code Section */

.qr-section {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-image {
  width: 80px; /* Adjust size */
  height: 80px;
}
</style>
