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
import { ref } from 'vue';
const mockData = ref([
  {
    name: 'Views',
    number: 1234,
    data: -11.0,
    trend: 'decrease'
  },
  {
    name: 'Total Customers',
    number: 5678,
    data: 5.2,
    trend: 'increase'
  },
  {
    name: 'Active Now',
    number: 342,
    data: 2.8,
    trend: 'increase'
  }
]);
</script>