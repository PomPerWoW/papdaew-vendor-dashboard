<template>
    <AddContract />
  <div class="main">
    <div class="head">
      <h1>Contract</h1>
      <button
        style="
          background-color: #a4c3b2;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          border: none;
          text-align: center;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        "
         @click="showModal = true"
      >
        <Icon icon="icon-park-outline:add-one" width="20" height="20" />
        <span>Add Contract</span>
      </button>
      <AddContract :isOpen="showModal" @close="showModal = false" />
    </div>

    <div class="grid-layout">
      <ContractCard />
      <ContractCard />
      <ContractCard />
      <ContractCard />
      <ContractCard />
      <ContractCard />
    </div>
  </div>
</template>
<script setup>
import ContractCard from '@/components/ContractCard.vue';
import AddContract from '@/components/AddContract.vue';

import { Icon } from '@iconify/vue';
import { ref } from 'vue';
const showModal = ref(false);
</script>
<style lang="css">
.main {
  padding: 20px;
}

h1 {
  font-weight: 500;
}
.grid-layout {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  grid-auto-rows: auto;
}
.head {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
