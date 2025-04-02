<template>
  <div class="main">
    <h1>Customer</h1>
    <div class="data-grid">
      <DataWidget />
      <DataWidget />
      <DataWidget />
      <DataWidget />
    </div>
    <div class="data-table">
      <h2>Customer List</h2>
      <p>List of all customers</p>
      <DataTable
        v-model:filters="filters"
        :value="customers"
        paginator
        :rows="10"
        dataKey="id"
        filterDisplay="row"
        :loading="loading"
        :globalFilterFields="[
          'name',
          'phone.name',
          'branch',
          'queue',
          'status',
        ]"
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
        <template #loading> Loading customers data. Please wait. </template>
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
        <Column
          header="Phone Number"
          style="min-width: 12rem"
        >
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span>{{ data.phone }}</span>
            </div>
          </template>
        </Column>
        <Column
          header="Branch"
          filterField="branch"
          :showFilterMenu="false"
          style="min-width: 14rem"
        >
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span>{{ data.branch.name }}</span>
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <MultiSelect
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="branchs"
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
          field="queue"
          header="Queue"
          :showFilterMenu="false"
          style="min-width: 12rem"
        >
       <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span>{{ data.queue }}</span>
            </div>
          </template>
          
        </Column>
        <Column
          field="status"
          header="Status"
          :showFilterMenu="false"
          style="min-width: 12rem"
        >
          <template #body="{ data }">
            <Tag :value="data.status" :severity="getSeverity(data.status)" />
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
    </div>
  </div>
</template>

<script setup>
import DataWidget from '@/components/DataWidget.vue';
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

const customers = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    branch: { value: null, matchMode: FilterMatchMode.IN },
    queue: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});
const branchs = ref([
  { name: 'Central World' },
  { name: 'Central Rama3' },
  { name: 'Seacon Bangkaphi' },
  { name: 'Central Pinklao' },
  { name: 'Robinson Ladkrabang' },
  { name: 'Central Bangna' }
]);
const statuses = ref(['Inactive', 'Active', 'New',  'Blacklist','unqualified' ]);
const loading = ref(true);

// Mock customer data since CustomerService is not available
const mockCustomers = [
    {
        id: 1000,
        name: 'James Butt',
        phone: '0823234234',
        company: 'Benton, John B Jr',
        date: '2015-09-13',
        status: 'Inactive',
        verified: false,
        activity: 17,
        branch: {name: 'Central World'},
        queue:'C012'
    },
    {
        id: 1001,
        name: 'Josephine Darakjy',
        phone: '0872364567',
        company: 'Chanay, Jeffrey A Esq',
        date: '2019-02-09',
        status: 'Active',
        verified: true,
        activity: 0,
        branch: {name: 'Central Rama3'},
        queue:'C014'
    },
    {
        id: 1002,
        name: 'Art Venere',
        phone: '0982347689',
        company: 'Chemel, James L Cpa',
        date: '2017-05-13',
        status: 'Active',
        verified: true,
        activity: 63,
        branch:{name: 'Seacon Bangkaphi'},
        queue:'C009'
    },
    {
        id: 1003,
        name: 'Lenna Paprocki',
        phone: '0678231234',
        company: 'Feltz Printing Service',
        date: '2020-09-15',
        status: 'Inactive',
        verified: false,
        activity: 37,
        branch: {name: 'Seacon Bangkaphi'},
        queue:'C011'
    },
    {
        id: 1004,
        name: 'Donette Foller',
        phone: '0914552367',
        company: 'Printing Dimensions',
        date: '2016-05-20',
        status: 'Inactive',
        verified: false,
        activity: 33,
        branch: {name: 'Central Pinklao'},
        queue:'A013'
    },
    {
        id: 1005,
        name: 'Simona Morasca',
        phone: '0856782390',
        company: 'Chapman, Ross E Esq',
        date: '2018-02-16',
        status: 'Blacklist',
        verified: false,
        activity: 68,
        branch: {name: 'Robinson Ladkrabang'},
        queue:'B015'
    },
    {
        id: 1006,
        name: 'Mitsue Tollner',
        phone: '0923456789',
        company: 'Morlong Associates',
        date: '2018-02-19',
        status: 'Blacklist',
        verified: false,
        activity: 54,
        branch: {name: 'Central Bangna'},
        queue:'A016'
    },
    {
        id: 1007,
        name: 'Leota Dilliard',
        phone: '0658793456',
        company: 'Commercial Press',
        date: '2019-08-13',
        status: 'Blacklist',
        verified: false,
        activity: 69,
        branch: {name: 'Central Bangna'},
        queue:'A017'
    },
    {
        id: 1008,
        name: 'Sage Wieser',
        phone: '0812349821',
        company: 'Truhlar And Truhlar Attys',
        date: '2018-11-21',
        status: 'New',
        verified: true,
        activity: 76,
        branch: {name: 'Seacon Bangkaphi'},
        queue:'A018'
    },
    {
        id: 1009,
        name: 'Kris Marrier',
        phone: '0983563444',
        company: 'King, Christopher A Esq',
        date: '2015-07-07',
        status: 'Active',
        verified: true,
        activity: 3,
        branch: {name: 'Central World'},
        queue:'A019'
    }
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

const getSeverity = (status) => {
    switch (status) {
        case 'Inactive':
            return 'danger';
        case 'Active':
            return 'success';
        case 'New':
            return 'info';
        case 'Blacklist':
            return 'contrast';
        default:
            return null;
    }
}
</script>

<style scoped>
.main {
  padding: 20px;
}
.data-grid {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}
h1 {
  font-weight: 500;
}
.data-table {
  margin-top: 2rem;
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  line-height: 2rem;
  
}
.data-table h2{
    font-weight: 600;
  }
</style>