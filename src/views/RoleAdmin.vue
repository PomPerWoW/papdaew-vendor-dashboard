<template>
  <div class="main">
    <h1>Role</h1>
    <div >
      <Tabs value="0"  >
        <TabList>
          <Tab value="0">All users</Tab>
          <Tab value="1">User Management role</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <DataTable
              v-model:filters="filters"
              :value="customers"
              paginator
              :rows="10"
              dataKey="id"
              filterDisplay="row"
              :loading="loading"
              :globalFilterFields="['name', 'date', 'role', 'status']"
            >
              <template #header>
                <div class="flex justify-end">
                  <IconField>
                    <InputIcon>
                      <i class="pi pi-search" />
                    </InputIcon>
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Keyword Search"
                    />
                  </IconField>
                </div>
              </template>
              <template #empty> No customers found. </template>
              <template #loading>
                Loading customers data. Please wait.
              </template>
              <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                  {{ data.name }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    @input="filterCallback()"
                    placeholder="Search by name"
                  />
                </template>
              </Column>
              <Column header="Date" style="min-width: 12rem">
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <span>{{ data.date }}</span>
                  </div>
                </template>
              </Column>
              <Column
                header="Role"
                filterField="role"
                :showFilterMenu="false"
                style="min-width: 14rem"
              >
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <span>{{ data.role.name }}</span>
                  </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <MultiSelect
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="roles"
                    optionLabel="name"
                    placeholder="Any"
                    style="min-width: 14rem"
                    :maxSelectedLabels="1"
                  >
                    <template #option="slotProps">
                      <div class="flex items-center gap-2">
                        <span>{{ slotProps.option.name }}</span>
                      </div>
                    </template>
                  </MultiSelect>
                </template>
              </Column>
              <Column
                field="status"
                header="Status"
                :showFilterMenu="false"
                style="min-width: 12rem"
              >
                <template #body="{ data }">
                  <Tag
                    :value="data.status"
                    :severity="getSeverity(data.status)"
                  />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <Select
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="statuses"
                    placeholder="Select One"
                    style="min-width: 12rem"
                    :showClear="true"
                  >
                    <template #option="slotProps">
                      <Tag
                        :value="slotProps.option"
                        :severity="getSeverity(slotProps.option)"
                      />
                    </template>
                  </Select>
                </template>
              </Column>
              <Column
                field="verified"
                header="Verified"
                dataType="boolean"
                style="min-width: 6rem"
              >
                <template #body="{ data }">
                  <i
                    class="pi"
                    :class="{
                      'pi-check-circle text-green-500': data.verified,
                      'pi-times-circle text-red-400': !data.verified,
                    }"
                  ></i>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <Checkbox
                    v-model="filterModel.value"
                    :indeterminate="filterModel.value === null"
                    binary
                    @change="filterCallback()"
                  />
                </template>
              </Column>
            </DataTable>
          </TabPanel>
          <TabPanel value="1">
            <h3>Manage acess</h3>
            <div class="header-actions">
              <p>Actions</p>
              <div style="display: flex; gap: 10rem; flex-direction: row">
                <p>Customer</p>
                <p>Vendor</p>
                <p>Admin</p>
              </div>
            </div>
            <Divider />
            <h4>Queue Management</h4>
            <div class="body-actions">
              <p>Join queues.</p>
              <div style="display: flex; gap: 12rem; flex-direction: row; margin-right: 1rem;">
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
              </div>
            </div>
            <div class="body-actions">
              <p>Monitor queue status.</p>
              <div style="display: flex; gap: 12rem; flex-direction: row; margin-right: 1rem;">
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
              </div>
            </div>
            <div class="body-actions">
              <p>Adjust queue capacity</p>
              <div style="display: flex; gap: 12rem; flex-direction: row; margin-right: 1rem;">
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
              </div>
            </div>
            <h4>Reservation</h4>
            <div class="body-actions">
              <p>Make reservations</p>
              <div style="display: flex; gap: 12rem; flex-direction: row; margin-right: 1rem;">
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
              </div>
            </div>
            <div class="body-actions">
              <p>Configure reservations</p>
              <div style="display: flex; gap: 12rem; flex-direction: row; margin-right: 1rem;">
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
              </div>
            </div>
            <h4>Communicate</h4>
            <div class="body-actions">
              <p>Communicate between Individual and Vendor</p>
              <div style="display: flex; gap: 12rem; flex-direction: row; margin-right: 1rem;">
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
              </div>
            </div>
            <div class="body-actions">
              <p>Handle customer complaints</p>
              <div style="display: flex; gap: 12rem; flex-direction: row; margin-right: 1rem;">
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
              </div>
            </div>
            <h4>Security</h4>
            <div class="body-actions">
              <p>View security logs</p>
              <div style="display: flex; gap: 12rem; flex-direction: row; margin-right: 1rem;">
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
              </div>
            </div>
            <div class="body-actions">
              <p>Modify encryption settings</p>
              <div style="display: flex; gap: 12rem; flex-direction: row; margin-right: 1rem;">
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
                <Checkbox v-model="checked" binary />
              </div>
            </div>
            
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
<style lang="css">
.main {
  padding: 20px;
}
h1,
h3 {
  font-weight: 500;
}
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 1rem 0;
}
.body-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 1rem 0;
}
h4 {
  font-weight: 500;
  background-color: aliceblue;
  padding: 0.5rem 0 0.5rem 0.25rem; ;
}
</style>
<script setup>
import Divider from 'primevue/divider';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

//checkbox
const checked = ref(false);

const customers = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  role: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});
const roles = ref([{ name: 'Admin' }, { name: 'Vendor' }]);
const statuses = ref([
  'Pending',
  'Complete',
  'Approved',
  'Rejected',
  'In progress',
]);
const loading = ref(true);

// Mock customer data since CustomerService is not available
const mockCustomers = [
  {
    id: 1000,
    name: 'James Butt',
    company: 'Benton, John B Jr',
    date: '2015-09-13',
    status: 'Pending',
    verified: false,
    activity: 17,
    role: { name: 'Admin' },
  },
  {
    id: 1001,
    name: 'Josephine Darakjy',
    company: 'Chanay, Jeffrey A Esq',
    date: '2019-02-09',
    status: 'Complete',
    verified: true,
    activity: 0,
    role: { name: 'Vendor' },
  },
  {
    id: 1002,
    name: 'Art Venere',
    company: 'Chemel, James L Cpa',
    date: '2017-05-13',
    status: 'Rejected',
    verified: true,
    activity: 63,
    role: { name: 'Vendor' },
  },
  {
    id: 1003,
    name: 'Lenna Paprocki',
    company: 'Feltz Printing Service',
    date: '2020-09-15',
    status: 'In progress',
    verified: false,
    activity: 37,
    role: { name: 'Vendor' },
  },
  {
    id: 1004,
    name: 'Donette Foller',
    company: 'Printing Dimensions',
    date: '2016-05-20',
    status: 'Approved',
    verified: false,
    activity: 33,
    role: { name: 'Vendor' },
  },
];

onMounted(() => {
  // Instead of fetching from service, use mock data
  setTimeout(() => {
    customers.value = mockCustomers.map(customer => {
      customer.date = new Date(customer.date);
      return customer;
    });
    loading.value = false;
  }, 1000); // Simulate network delay
});

const getSeverity = status => {
  switch (status) {
    case 'Pending':
      return 'warn';
    case 'Complete':
      return 'success';
    case 'Approved':
      return 'info';
    case 'Rejected':
      return 'contrast';
    case 'In progress':
      return 'secondary';
    default:
      return null;
  }
};
</script>
