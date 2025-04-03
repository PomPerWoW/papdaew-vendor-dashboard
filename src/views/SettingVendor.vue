<template>
  <div class="main">
    <h1>Setting</h1>
    <p>Manage your account setting and preferences</p>
    <div class="setting">
      <Tabs value="0">
        <TabList>
          <Tab value="0">Account</Tab>
          <Tab value="1">General</Tab>
          <Tab value="2">Security</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <div class="set">
              <div>
                <h3>profile</h3>
                <p>set your account details</p>
              </div>
              <div>
                <div style="display: flex; flex-direction: row; ">
                  <div style="margin-right: 1.2rem;">
                    <label for="name">Name</label>
                    <InputText type="text" v-model="formData.name" />
                  </div>
                  <div>
                    <label for="name">Surname</label>
                    <InputText type="text" v-model="formData.surname" />
                  </div>
                </div>
                <label for="name">Email</label>
                <InputText type="text" v-model="formData.email" />
              </div>
            </div>
          </TabPanel>
          <TabPanel value="1">
            <p class="m-0">draft</p>
          </TabPanel>
          <TabPanel value="2">
            <p class="m-0">draft</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
<script setup>
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const formData = ref({
  name: '',
  surname: '',
  email: '',
});
</script>
<style lang="css">
.main {
  padding: 20px;
}

h1 {
  font-weight: 500;
}
.setting {
  margin-top: 20px;
}
.set {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
