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
      </div>

      <div class="table-container">
        <DataTable
          :value="customers"
          paginator
          :rows="10"
          dataKey="id"
          :loading="loading"
          class="customer-table"
        >
          <template #header>
            <div class="table-header">
              <div class="search-container">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText placeholder="Search customers..." />
                </span>
              </div>
            </div>
          </template>
          <template #empty> No customers found. </template>
          <template #loading>
            <!-- Empty template to show nothing when loading -->
          </template>
          <Column field="name" header="Name" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="customer-name">{{ data.name }}</div>
            </template>
          </Column>
          <Column header="Phone Number" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="customer-phone">{{ data.phone }}</div>
            </template>
          </Column>
          <Column header="Branch" style="min-width: 14rem">
            <template #body="{ data }">
              <div class="customer-branch">{{ data.branch.name }}</div>
            </template>
          </Column>
          <Column field="queue" header="Queue" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="customer-queue">{{ data.queue }}</div>
            </template>
          </Column>
          <Column field="status" header="Status" style="min-width: 12rem">
            <template #body="{ data }">
              <Tag
                :value="data.status"
                :severity="getSeverity(data.status)"
                class="status-tag"
              />
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
import { Icon } from '@iconify/vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';

const customers = ref([]);
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

.table-container {
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.search-container {
  width: 300px;
}

.search-input {
  width: 100%;
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

/* Dropdown styling */
:deep(.p-dropdown-panel) {
  background-color: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 6px;
}

:deep(.p-dropdown-items) {
  padding: 0;
}

:deep(.p-dropdown-item) {
  padding: 10px 12px;
  margin-bottom: 4px;
  color: #333;
  background-color: white;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.p-dropdown-item:last-child) {
  margin-bottom: 0;
}

:deep(.p-dropdown-item:hover) {
  background-color: #e6f0eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

:deep(.p-dropdown-item.p-highlight) {
  background-color: #6b9080;
  color: white;
  box-shadow: 0 2px 5px rgba(107, 144, 128, 0.3);
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
@media (max-width: 768px) {
  .search-container {
    width: 100%;
  }
}

@media (max-width: 480px) {
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
