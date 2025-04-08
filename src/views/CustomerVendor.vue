<template>
  <div class="main">
    <div class="page-header">
      <div class="header-content">
        <h1>Customer Management</h1>
        <p class="description">View and manage your customer information</p>
      </div>
      <div class="header-actions">
        <div class="period-selector">
          <button
            v-for="period in ['day', 'week', 'month', 'year']"
            :key="period"
            :class="['period-button', { active: selectedPeriod === period }]"
            @click="changePeriod(period)"
          >
            {{ period.charAt(0).toUpperCase() + period.slice(1) }}
          </button>
        </div>
        <button class="export-button">
          <Icon icon="material-symbols:download" />
          <span>Export List</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <p>Loading customer data...</p>
    </div>

    <div v-else>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-content">
            <div class="metric-info">
              <h3>Total Customers</h3>
              <p class="metric-value">{{ totalCustomers.toLocaleString() }}</p>
              <p class="metric-trend" :class="customerTrend.direction">
                <Icon
                  :icon="
                    'material-symbols:trending-' +
                    (customerTrend.direction === 'neutral'
                      ? 'flat'
                      : customerTrend.direction === 'positive'
                        ? 'up'
                        : 'down')
                  "
                />
                <span
                  >{{ customerTrend.percentage }}% from last
                  {{ selectedPeriod }}</span
                >
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
              <p class="metric-value">{{ newCustomers.toLocaleString() }}</p>
              <p class="metric-trend" :class="newCustomerTrend.direction">
                <Icon
                  :icon="
                    'material-symbols:trending-' +
                    (newCustomerTrend.direction === 'neutral'
                      ? 'flat'
                      : newCustomerTrend.direction === 'positive'
                        ? 'up'
                        : 'down')
                  "
                />
                <span
                  >{{ newCustomerTrend.percentage }}% from last
                  {{ selectedPeriod }}</span
                >
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
              <p class="metric-value">{{ activeCustomers.toLocaleString() }}</p>
              <p class="metric-trend" :class="activeCustomerTrend.direction">
                <Icon
                  :icon="
                    'material-symbols:trending-' +
                    (activeCustomerTrend.direction === 'neutral'
                      ? 'flat'
                      : activeCustomerTrend.direction === 'positive'
                        ? 'up'
                        : 'down')
                  "
                />
                <span
                  >{{ activeCustomerTrend.percentage }}% from last
                  {{ selectedPeriod }}</span
                >
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
              <p class="metric-value">{{ retentionRate }}%</p>
              <p class="metric-trend" :class="retentionTrend.direction">
                <Icon
                  :icon="
                    'material-symbols:trending-' +
                    (retentionTrend.direction === 'neutral'
                      ? 'flat'
                      : retentionTrend.direction === 'positive'
                        ? 'up'
                        : 'down')
                  "
                />
                <span
                  >{{ retentionTrend.percentage }}% from last
                  {{ selectedPeriod }}</span
                >
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
            :value="filteredCustomers"
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
                    <InputText
                      v-model="searchTerm"
                      placeholder="Search customers..."
                    />
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import { useUserStore } from '../stores/counter';
import { useToast } from 'vue-toast-notification';
import {
  getCustomerAnalytics,
  getBranches,
  getQueuesByBranch,
} from '../lib/api';

// User store for user/vendor info
const userStore = useUserStore();
const $toast = useToast();

// Vendor ID from the user store
const vendorId = computed(() => userStore.user?.data?.staff?.vendorId);
const branchId = computed(() => userStore.branchId);

const customers = ref([]);
const loading = ref(true);
const searchTerm = ref('');
const totalCustomers = ref(0);
const newCustomers = ref(0);
const activeCustomers = ref(0);
const retentionRate = ref(0);
const customerTrend = ref({
  percentage: '0',
  direction: 'neutral',
});
const newCustomerTrend = ref({
  percentage: '0',
  direction: 'neutral',
});
const activeCustomerTrend = ref({
  percentage: '0',
  direction: 'neutral',
});
const retentionTrend = ref({
  percentage: '0',
  direction: 'neutral',
});
const selectedPeriod = ref('month');
const branches = ref([]);

// Initialize data on component mounted
onMounted(async () => {
  if (!vendorId.value) {
    console.error('No vendor ID available');
    $toast.error('User information not available');
    return;
  }

  try {
    // Load branches first
    await loadBranches();

    // Then load customer data
    await loadCustomerAnalytics();
  } catch (error) {
    console.error('Error initializing customer view:', error);
    $toast.error('Failed to initialize customer data');
  }
});

// Load customer analytics data
const loadCustomerAnalytics = async () => {
  try {
    loading.value = true;

    // Get customer analytics from the API
    const analyticsResponse = await getCustomerAnalytics(
      vendorId.value,
      selectedPeriod.value,
      branchId.value
    );

    if (analyticsResponse.status === 'success') {
      const data = analyticsResponse.data.metrics;

      // Update metrics with real data
      totalCustomers.value = data.totalCustomers || 0;
      newCustomers.value = data.newCustomers || 0;
      activeCustomers.value = data.activeCustomers || 0;
      retentionRate.value = data.retentionRate || 0;

      // Update trends with real data
      const trends = data.trends || {};
      customerTrend.value = {
        percentage: Math.abs(trends.totalCustomers || 0).toFixed(1),
        direction: getTrendDirection(trends.totalCustomers || 0),
      };

      newCustomerTrend.value = {
        percentage: Math.abs(trends.newCustomers || 0).toFixed(1),
        direction: getTrendDirection(trends.newCustomers || 0),
      };

      activeCustomerTrend.value = {
        percentage: Math.abs(trends.activeCustomers || 0).toFixed(1),
        direction: getTrendDirection(trends.activeCustomers || 0),
      };

      retentionTrend.value = {
        percentage: Math.abs(trends.retention || 0).toFixed(1),
        direction: getTrendDirection(trends.retention || 0),
      };

      // Get customer list from API if available, otherwise use fallback data
      if (data.customers && Array.isArray(data.customers)) {
        customers.value = processCustomerData(data.customers);
      } else {
        console.warn('No customer data received from API, using fallback data');
        // Only use fallback in development
        customers.value = import.meta.env.DEV ? mockCustomers : [];
      }
    }
  } catch (error) {
    console.error('Error loading customer analytics:', error);
    $toast.error('Failed to load customer data');
    // Fallback to mock data in development mode only
    if (import.meta.env.DEV) {
      totalCustomers.value = 3500;
      newCustomers.value = 350;
      activeCustomers.value = 2800;
      retentionRate.value = 84;
      customers.value = mockCustomers;

      customerTrend.value = { percentage: '5.2', direction: 'positive' };
      newCustomerTrend.value = { percentage: '12.5', direction: 'positive' };
      activeCustomerTrend.value = { percentage: '3.7', direction: 'positive' };
      retentionTrend.value = { percentage: '0.8', direction: 'positive' };
    }
  } finally {
    loading.value = false;
  }
};

// Process customer data from API
const processCustomerData = apiCustomers => {
  return apiCustomers.map(customer => {
    return {
      id: customer.id || `cust-${Math.random().toString(36).substr(2, 9)}`,
      name: customer.name || 'Unknown Customer',
      phone: customer.phone || 'N/A',
      date: customer.joinDate || new Date().toISOString().split('T')[0],
      status: mapCustomerStatus(customer.status),
      verified: customer.verified || false,
      branch: {
        name: getBranchNameById(customer.branchId) || 'Main Branch',
        id: customer.branchId,
      },
      queue: customer.queueNumber || '-',
      branchId: customer.branchId,
      lastVisit: customer.lastVisit || null,
      visitCount: customer.visitCount || 0,
    };
  });
};

// Load branches data
const loadBranches = async () => {
  try {
    const branchesResponse = await getBranches(vendorId.value);
    if (branchesResponse.status === 'success') {
      branches.value = branchesResponse.data;
    }
  } catch (error) {
    console.error('Error loading branches:', error);
  }
};

// Get branch name by ID
const getBranchNameById = branchId => {
  const branch = branches.value.find(b => b.id === branchId);
  return branch ? branch.branchName : 'Unknown Branch';
};

// Map API customer status to UI status
const mapCustomerStatus = status => {
  if (!status) return 'Inactive';

  switch (status.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'new':
      return 'New';
    case 'inactive':
      return 'Inactive';
    case 'blacklisted':
      return 'Blacklist';
    default:
      return 'Inactive';
  }
};

// Helper function to determine trend direction
const getTrendDirection = value => {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
};

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

// Change period and reload data
const changePeriod = async period => {
  selectedPeriod.value = period;
  await loadCustomerAnalytics();
};

// Mock customer data as fallback
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

// Filtered customers computed property
const filteredCustomers = computed(() => {
  if (!searchTerm.value.trim()) {
    return customers.value;
  }

  const term = searchTerm.value.toLowerCase();
  return customers.value.filter(
    customer =>
      customer.name.toLowerCase().includes(term) ||
      customer.phone.toLowerCase().includes(term) ||
      customer.branch.name.toLowerCase().includes(term) ||
      (customer.queue && customer.queue.toLowerCase().includes(term))
  );
});
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

/* New styles for period selector */
.period-selector {
  display: flex;
  gap: 8px;
  margin-right: 16px;
}

.period-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: white;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.period-button:hover {
  background-color: #f5f5f5;
}

.period-button.active {
  background-color: #6b9080;
  color: white;
  border-color: #6b9080;
}

.header-actions {
  display: flex;
  align-items: center;
}

.loading-state {
  padding: 40px;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  color: #718096;
  font-size: 16px;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .period-selector {
    margin-right: 0;
    justify-content: space-between;
  }
}
</style>
