<template>
  <div class="box">
    <div>
      <span>View</span>
      <h3>1,234</h3>
    </div>
    <div class="right">
      <span>+11.1%</span> 
        <Icon icon="ph:trend-up" width="20" height="20"/>
    </div>
    
  </div>
</template>
<style scoped lang="css">
.box {
  background-color: #a4c3b2;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.box h3{
    font-weight: 700;
}
.right{
    display: flex;
    justify-content: end;
    align-items: end;
    margin-left: 1.5rem;
}
</style>
<script setup>
import { Icon } from '@iconify/vue';
</script>