<template>
  <div class="main">
    <div class="page-header">
      <div class="header-content">
        <h1>Customer Management</h1>
        <p class="description">View and manage your customer information</p>
      </div>
      <div class="header-actions">
        <button class="export-button">
          <Icon icon="material-symbols:download" />
          <span>Export List</span>
        </button>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-content">
          <div class="metric-info">
            <h3>Total Customers</h3>
            <p class="metric-value">1,432</p>
            <p class="metric-trend positive">
              <Icon icon="material-symbols:trending-up" />
              <span>12% from last month</span>
            </p>
          </div>
          <div class="metric-icon">
            <Icon icon="material-symbols:group" />
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-content">
          <div class="metric-info">
            <h3>New Customers</h3>
            <p class="metric-value">86</p>
            <p class="metric-trend positive">
              <Icon icon="material-symbols:trending-up" />
              <span>8% from last month</span>
            </p>
          </div>
          <div class="metric-icon">
            <Icon icon="material-symbols:person-add" />
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-content">
          <div class="metric-info">
            <h3>Active Customers</h3>
            <p class="metric-value">967</p>
            <p class="metric-trend neutral">
              <Icon icon="material-symbols:trending-flat" />
              <span>Same as last month</span>
            </p>
          </div>
          <div class="metric-icon">
            <Icon icon="material-symbols:person-check" />
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-content">
          <div class="metric-info">
            <h3>Avg. Retention</h3>
            <p class="metric-value">78%</p>
            <p class="metric-trend positive">
              <Icon icon="material-symbols:trending-up" />
              <span>5% from last month</span>
            </p>
          </div>
          <div class="metric-icon">
            <Icon icon="material-symbols:autorenew" />
          </div>
        </div>
      </div>
    </div>

    <div class="card data-card">
      <div class="card-header">
        <div>
          <h2>Customer List</h2>
          <p class="card-description">Manage all your registered customers</p>
        </div>
        <div class="card-actions">
          <button class="filter-button">
            <Icon icon="material-symbols:filter-list" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div class="table-container">
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
            'phone',
            'branch.name',
            'queue',
            'status',
          ]"
          class="customer-table"
        >
          <template #header>
            <div class="table-header">
              <IconField class="search-field">
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search customers..."
                  class="search-input"
                />
              </IconField>
            </div>
          </template>
          <template #empty> No customers found. </template>
          <template #loading> Loading customers data. Please wait. </template>
          <Column field="name" header="Name" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="customer-name">{{ data.name }}</div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="text"
                @input="filterCallback()"
                placeholder="Search by name"
                class="filter-input"
              />
            </template>
          </Column>
          <Column header="Phone Number" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="customer-phone">{{ data.phone }}</div>
            </template>
          </Column>
          <Column
            header="Branch"
            filterField="branch"
            :showFilterMenu="false"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <div class="customer-branch">{{ data.branch.name }}</div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <MultiSelect
                v-model="filterModel.value"
                @change="filterCallback()"
                :options="branchs"
                optionLabel="name"
                placeholder="Any"
                class="filter-select"
                :maxSelectedLabels="1"
              >
                <template #option="slotProps">
                  <div>{{ slotProps.option.name }}</div>
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
              <div class="customer-queue">{{ data.queue }}</div>
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
                class="status-tag"
              />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select
                v-model="filterModel.value"
                @change="filterCallback()"
                :options="statuses"
                placeholder="Select Status"
                class="filter-select"
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
                class="verification-icon pi"
                :class="{
                  'pi-check-circle verified': data.verified,
                  'pi-times-circle not-verified': !data.verified,
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
          <Column
            header="Actions"
            style="min-width: 6rem"
            headerClass="action-header"
          >
            <template #body>
              <div class="action-buttons">
                <button class="action-btn view-btn">
                  <i class="pi pi-eye"></i>
                </button>
                <button class="action-btn edit-btn">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { Icon } from '@iconify/vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const customers = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  branch: { value: null, matchMode: FilterMatchMode.IN },
  queue: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});
const branchs = ref([
  { name: 'Central World' },
  { name: 'Central Rama3' },
  { name: 'Seacon Bangkaphi' },
  { name: 'Central Pinklao' },
  { name: 'Robinson Ladkrabang' },
  { name: 'Central Bangna' },
]);
const statuses = ref(['Inactive', 'Active', 'New', 'Blacklist', 'unqualified']);
const loading = ref(true);

const getSeverity = status => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'New':
      return 'info';
    case 'Inactive':
      return 'warning';
    case 'Blacklist':
      return 'danger';
    default:
      return null;
  }
};

onMounted(() => {
  setTimeout(() => {
    customers.value = mockCustomers;
    loading.value = false;
  }, 1000);
});

const mockCustomers = [
  {
    id: 1000,
    name: 'James Butt',
    phone: '082-323-4234',
    company: 'Benton, John B Jr',
    date: '2015-09-13',
    status: 'Inactive',
    verified: false,
    activity: 17,
    branch: { name: 'Central World' },
    queue: 'C012',
  },
  {
    id: 1001,
    name: 'Josephine Darakjy',
    phone: '087-236-4567',
    company: 'Chanay, Jeffrey A Esq',
    date: '2019-02-09',
    status: 'Active',
    verified: true,
    activity: 0,
    branch: { name: 'Central Rama3' },
    queue: 'C014',
  },
  {
    id: 1002,
    name: 'Art Venere',
    phone: '098-234-7689',
    company: 'Chemel, James L Cpa',
    date: '2017-05-13',
    status: 'Active',
    verified: true,
    activity: 63,
    branch: { name: 'Seacon Bangkaphi' },
    queue: 'C009',
  },
  {
    id: 1003,
    name: 'Lenna Paprocki',
    phone: '067-823-1234',
    company: 'Feltz Printing Service',
    date: '2020-09-15',
    status: 'Inactive',
    verified: false,
    activity: 37,
    branch: { name: 'Seacon Bangkaphi' },
    queue: 'C011',
  },
  {
    id: 1004,
    name: 'Donette Foller',
    phone: '062-874-9876',
    company: 'Printing Dimensions',
    date: '2016-05-20',
    status: 'New',
    verified: true,
    activity: 33,
    branch: { name: 'Central Pinklao' },
    queue: 'C016',
  },
  {
    id: 1005,
    name: 'Simona Morasca',
    phone: '091-324-5678',
    company: 'Chapman, Ross E Esq',
    date: '2018-02-16',
    status: 'Blacklist',
    verified: false,
    activity: 68,
    branch: { name: 'Robinson Ladkrabang' },
    queue: 'C021',
  },
  {
    id: 1006,
    name: 'Mitsue Tollner',
    phone: '082-468-9012',
    company: 'Morlong Associates',
    date: '2018-02-19',
    status: 'Active',
    verified: true,
    activity: 54,
    branch: { name: 'Central Bangna' },
    queue: 'C017',
  },
];
</script>

<style scoped>
.main {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-content h1 {
  font-weight: 600;
  font-size: 24px;
  color: #333;
  margin: 0 0 4px 0;
}

.description {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.export-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-button:hover {
  background-color: #5a7b6c;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.metric-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.metric-info h3 {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
  font-weight: 500;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.metric-trend.positive {
  color: #22c55e;
}

.metric-trend.negative {
  color: #ef4444;
}

.metric-trend.neutral {
  color: #888;
}

.metric-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 24px;
  background-color: rgba(107, 144, 128, 0.1);
  color: #6b9080;
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.card-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-description {
  color: #666;
  font-size: 14px;
  margin: 4px 0 0 0;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f7fa;
  color: #555;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-button:hover {
  background-color: #e6f0eb;
}

.table-container {
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.search-field {
  width: 300px;
}

.search-input {
  width: 100%;
}

.filter-input,
.filter-select {
  width: 100%;
  font-size: 14px;
}

/* DataTable customization */
:deep(.p-datatable) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.p-datatable .p-datatable-header) {
  background-color: white;
  border: none;
  padding: 0;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f5f7fa;
  color: #555;
  font-weight: 500;
  padding: 12px 16px;
  border-color: #eee;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: white;
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f8f9fa;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 12px 16px;
  border-color: #f5f5f5;
}

:deep(.p-tag) {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}

.customer-name {
  font-weight: 500;
  color: #333;
}

.customer-phone,
.customer-branch,
.customer-queue {
  color: #555;
}

.verification-icon {
  font-size: 18px;
}

.verification-icon.verified {
  color: #22c55e;
}

.verification-icon.not-verified {
  color: #ef4444;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-btn {
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.view-btn:hover {
  background-color: rgba(14, 165, 233, 0.2);
}

.edit-btn {
  background-color: rgba(107, 144, 128, 0.1);
  color: #6b9080;
}

.edit-btn:hover {
  background-color: rgba(107, 144, 128, 0.2);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 12px;
  }

  .search-field {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
  }

  .export-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
