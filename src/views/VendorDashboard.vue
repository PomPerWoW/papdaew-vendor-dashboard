<template>
  <div class="dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1>Dashboard</h1>
        <p class="welcome-message">
          Welcome back,
          <span class="vendor-name">{{ user?.data.username || 'Vendor' }}</span>
          <span v-if="!userStore.isRootAccount" class="branch-indicator"
            >({{ branchName }} Branch)</span
          >
        </p>
      </div>
      <div class="header-right">
        <div class="date-display">
          <Icon icon="material-symbols:calendar-today" />
          <span>{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <p>Loading dashboard data...</p>
    </div>

    <div v-else>
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card customers">
          <div class="card-icon">
            <Icon icon="material-symbols:groups" />
          </div>
          <div class="card-content">
            <h3 class="card-title">Total Customers</h3>
            <p class="card-value">{{ totalCustomers.toLocaleString() }}</p>
            <div class="card-trend" :class="customerTrend.direction">
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
                >{{ customerTrend.percentage }}% vs previous
                {{ chartPeriod }}</span
              >
            </div>
          </div>
        </div>

        <div class="summary-card queues">
          <div class="card-icon">
            <Icon icon="material-symbols:format-list-numbered" />
          </div>
          <div class="card-content">
            <h3 class="card-title">Active Queues</h3>
            <p class="card-value">{{ activeQueues.toLocaleString() }}</p>
            <div class="card-trend" :class="queueTrend.direction">
              <Icon
                :icon="
                  'material-symbols:trending-' +
                  (queueTrend.direction === 'neutral'
                    ? 'flat'
                    : queueTrend.direction === 'positive'
                      ? 'up'
                      : 'down')
                "
              />
              <span
                >{{ queueTrend.percentage }}% vs previous
                {{ chartPeriod }}</span
              >
            </div>
          </div>
        </div>

        <div class="summary-card ratings">
          <div class="card-icon">
            <Icon icon="material-symbols:star" />
          </div>
          <div class="card-content">
            <h3 class="card-title">Average Rating</h3>
            <p class="card-value">
              {{ averageRating.toFixed(1) }}<span class="rating-max">/5</span>
            </p>
            <div class="card-trend" :class="ratingTrend.direction">
              <Icon
                :icon="
                  'material-symbols:trending-' +
                  (ratingTrend.direction === 'neutral'
                    ? 'flat'
                    : ratingTrend.direction === 'positive'
                      ? 'up'
                      : 'down')
                "
              />
              <span
                >{{ ratingTrend.percentage }}% vs previous
                {{ chartPeriod }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Chart Section -->
        <div class="chart-section">
          <div class="chart-header">
            <div>
              <h2>Performance Overview</h2>
              <p class="chart-subtitle">
                {{ userStore.isRootAccount ? 'All Branches' : 'Your Branch' }} -
                Monthly customer visits
              </p>
            </div>
            <div class="chart-controls">
              <select v-model="chartPeriod" class="period-select">
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
          <div class="chart-placeholder">
            <!-- In a real app, a chart component would be used here -->
            <div class="chart-bars">
              <div
                v-for="(value, month) in monthlyCustomers"
                :key="month"
                class="chart-bar-container"
              >
                <div
                  class="chart-bar"
                  :style="{
                    height: `${Math.min((value / (Math.max(...Object.values(monthlyCustomers)) || 1)) * 100, 100)}%`,
                  }"
                ></div>
                <span class="chart-label">{{ month }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Branch Status - Only for root accounts -->
        <div v-if="userStore.isRootAccount" class="branches-section">
          <div class="section-header">
            <h2>Branch Status</h2>
            <router-link to="/branch" class="view-all">View All</router-link>
          </div>

          <div class="branch-cards">
            <div
              v-for="(branch, index) in branches"
              :key="index"
              class="branch-card"
            >
              <div class="branch-header">
                <h3>{{ branch.name }}</h3>
                <span class="status-badge" :class="branch.status">{{
                  branch.status
                }}</span>
              </div>
              <div class="branch-stats">
                <div class="stat">
                  <Icon icon="material-symbols:people" />
                  <span
                    >{{ branch.currentCustomers }}/{{ branch.capacity }}</span
                  >
                </div>
                <div class="stat">
                  <Icon icon="material-symbols:format-list-numbered" />
                  <span>{{ branch.queueCount }} in queue</span>
                </div>
              </div>
              <div class="branch-footer">
                <button class="branch-action">Manage Queue</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
          <div class="section-header">
            <h2>Quick Actions</h2>
          </div>

          <div class="action-buttons">
            <!-- Root Account Actions -->
            <button v-if="userStore.isRootAccount" class="action-button">
              <Icon icon="material-symbols:add-business" />
              <span>Add Branch</span>
            </button>

            <!-- Branch Staff Actions -->
            <router-link
              v-if="userStore.isStaff && !userStore.isRootAccount"
              to="/queue-vendor"
              class="action-button"
            >
              <Icon icon="material-symbols:format-list-numbered" />
              <span>Manage Queue</span>
            </router-link>

            <!-- Common Actions -->
            <button class="action-button">
              <Icon icon="material-symbols:person" />
              <span>View Customers</span>
            </button>
            <button class="action-button">
              <Icon icon="material-symbols:bar-chart" />
              <span>View Reports</span>
            </button>
            <button class="action-button">
              <Icon icon="material-symbols:support-agent" />
              <span>Get Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { Icon } from '@iconify/vue';
import { useUserStore } from '../stores/counter';
import {
  getBranches,
  getVendorAnalyticsOverview,
  getCustomerAnalytics,
  getRatingsAnalytics,
} from '../lib/api';

const userStore = useUserStore();
const user = computed(() => userStore.user);
const branchName = ref('');
const totalCustomers = ref(0);
const activeQueues = ref(0);
const averageRating = ref(0);
const loading = ref(true);
const analyticsData = ref(null);
const customerTrend = ref({
  percentage: 0,
  direction: 'neutral',
});
const queueTrend = ref({
  percentage: 0,
  direction: 'neutral',
});
const ratingTrend = ref({
  percentage: 0,
  direction: 'neutral',
});

// Period state
const chartPeriod = ref('month');

// Branches data
const branches = ref([]);

// Fetch data based on user type (root or branch staff)
onMounted(async () => {
  loading.value = true;
  try {
    if (userStore.isRootAccount) {
      // Fetch aggregate data across all branches
      await fetchAllBranchesData();
    } else if (userStore.branchId) {
      // Fetch data for specific branch
      await fetchBranchData(userStore.branchId);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    loading.value = false;
  }
});

// Fetch data for all branches (root account)
const fetchAllBranchesData = async (period = 'month') => {
  const vendorId = userStore.user.data.staff.vendorId;

  try {
    // Get vendor analytics overview
    const analyticsResponse = await getVendorAnalyticsOverview(
      vendorId,
      period
    );
    if (analyticsResponse.status === 'success') {
      analyticsData.value = analyticsResponse.data;

      // Update metrics from the response
      totalCustomers.value =
        analyticsData.value.vendorMetrics.totalCustomers || 0;
      activeQueues.value = analyticsData.value.vendorMetrics.totalQueues || 0;
      averageRating.value = analyticsData.value.vendorMetrics.avgRating || 0;

      // Get branches data
      const branchesResponse = await getBranches(vendorId);
      if (branchesResponse.status === 'success') {
        // Map branches to the format expected by the UI
        branches.value = branchesResponse.data.map(branch => {
          const branchMetrics =
            analyticsData.value.branchesSummary.find(b => b.id === branch.id)
              ?.metrics || {};

          return {
            id: branch.id,
            name: branch.branchName,
            status: getStatusFromBranchState(branch.status),
            currentCustomers: branchMetrics.totalCustomers || 0,
            capacity: 100, // This could be a property on the branch model in the future
            queueCount: branchMetrics.totalQueues || 0,
          };
        });
      }

      // Get customer analytics for trends
      const customerAnalyticsResponse = await getCustomerAnalytics(
        vendorId,
        period
      );
      if (customerAnalyticsResponse.status === 'success') {
        const trends = customerAnalyticsResponse.data.metrics.trends || {};
        customerTrend.value = {
          percentage: Math.abs(trends.customers || 0).toFixed(1),
          direction: getTrendDirection(trends.customers || 0),
        };
        queueTrend.value = {
          percentage: Math.abs(trends.queues || 0).toFixed(1),
          direction: getTrendDirection(trends.queues || 0),
        };
      }

      // Get ratings analytics
      const ratingsAnalyticsResponse = await getRatingsAnalytics(
        vendorId,
        period
      );
      if (ratingsAnalyticsResponse.status === 'success') {
        const ratingTrends = ratingsAnalyticsResponse.data.ratings.trends || {};
        ratingTrend.value = {
          percentage: Math.abs(ratingTrends.average || 0).toFixed(1),
          direction: getTrendDirection(ratingTrends.average || 0),
        };
      }

      // Update chart data
      updateChartData(customerAnalyticsResponse.data.metrics.history || {});
    }
  } catch (error) {
    console.error('Error fetching branch data:', error);
  }
};

// Fetch data for a specific branch (branch staff)
const fetchBranchData = async (branchId, period = 'month') => {
  const vendorId = userStore.user.data.staff.vendorId;

  try {
    // Get branch specific analytics
    const customerAnalyticsResponse = await getCustomerAnalytics(
      vendorId,
      period,
      branchId
    );

    if (customerAnalyticsResponse.status === 'success') {
      const branchMetrics = customerAnalyticsResponse.data.metrics || {};
      totalCustomers.value = branchMetrics.totalCustomers || 0;
      activeQueues.value = branchMetrics.totalQueues || 0;

      const trends = branchMetrics.trends || {};
      customerTrend.value = {
        percentage: Math.abs(trends.customers || 0).toFixed(1),
        direction: getTrendDirection(trends.customers || 0),
      };
      queueTrend.value = {
        percentage: Math.abs(trends.queues || 0).toFixed(1),
        direction: getTrendDirection(trends.queues || 0),
      };

      // Update chart data
      updateChartData(branchMetrics.history || {});
    }

    // Get ratings analytics for the branch
    const ratingsAnalyticsResponse = await getRatingsAnalytics(
      vendorId,
      period,
      branchId
    );

    if (ratingsAnalyticsResponse.status === 'success') {
      averageRating.value = ratingsAnalyticsResponse.data.ratings.average || 0;

      const ratingTrends = ratingsAnalyticsResponse.data.ratings.trends || {};
      ratingTrend.value = {
        percentage: Math.abs(ratingTrends.average || 0).toFixed(1),
        direction: getTrendDirection(ratingTrends.average || 0),
      };
    }

    // Set branch name
    const branchesResponse = await getBranches(vendorId);
    if (branchesResponse.status === 'success') {
      const branch = branchesResponse.data.find(b => b.id === branchId);
      branchName.value = branch ? branch.branchName : 'Your';
    }
  } catch (error) {
    console.error(`Error fetching data for branch ${branchId}:`, error);
  }
};

// Now that the functions are defined, we can watch for period changes
watchEffect(async () => {
  if (userStore.user && chartPeriod.value) {
    try {
      if (userStore.isRootAccount) {
        await fetchAllBranchesData(chartPeriod.value);
      } else if (userStore.branchId) {
        await fetchBranchData(userStore.branchId, chartPeriod.value);
      }
    } catch (error) {
      console.error('Error updating data for period change:', error);
    }
  }
});

// Helper function to determine trend direction
const getTrendDirection = value => {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
};

// Helper function to map branch status to UI status
const getStatusFromBranchState = status => {
  switch (status) {
    case 'active':
      return 'open';
    case 'inactive':
      return 'closed';
    case 'temporary-closed':
      return 'closed';
    case 'coming-soon':
      return 'closed';
    default:
      return 'open';
  }
};

// Get current date
const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Monthly data for chart
const monthlyCustomers = ref({
  Jan: 0,
  Feb: 0,
  Mar: 0,
  Apr: 0,
  May: 0,
  Jun: 0,
  Jul: 0,
  Aug: 0,
  Sep: 0,
  Oct: 0,
  Nov: 0,
  Dec: 0,
});

// Update chart data based on period
const updateChartData = historyData => {
  // Reset monthly data
  monthlyCustomers.value = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  // Update with real data if available
  if (historyData && typeof historyData === 'object') {
    Object.keys(historyData).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(monthlyCustomers.value, key)) {
        monthlyCustomers.value[key] = historyData[key];
      }
    });
  }
};
</script>

<style scoped>
.dashboard {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  color: #333;
}

/* Header Styles */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #2d3748;
}

.welcome-message {
  margin: 0;
  color: #718096;
  font-size: 16px;
}

.vendor-name {
  font-weight: 600;
  color: #6b9080;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f7fafc;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #718096;
}

.date-display svg {
  color: #6b9080;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.summary-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.04);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
}

.card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  margin-right: 18px;
  font-size: 28px;
  flex-shrink: 0;
}

.customers .card-icon {
  background-color: rgba(66, 153, 225, 0.1);
  color: #4299e1;
}

.queues .card-icon {
  background-color: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.ratings .card-icon {
  background-color: rgba(236, 201, 75, 0.1);
  color: #ecc94b;
}

.card-content {
  flex: 1;
}

.card-title {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 500;
  color: #718096;
}

.card-value {
  margin: 0 0 8px 0;
  font-size: 30px;
  font-weight: 700;
  color: #2d3748;
}

.rating-max {
  font-size: 18px;
  color: #a0aec0;
  font-weight: 500;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
}

.card-trend.positive {
  color: #48bb78;
}

.card-trend.negative {
  color: #f56565;
}

.card-trend.neutral {
  color: #a0aec0;
}

/* Dashboard Content */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-section {
  grid-column: span 1;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.branches-section {
  grid-column: span 1;
  grid-row: span 2;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.quick-actions-section {
  grid-column: span 1;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f4f8;
}

.chart-header h2 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.chart-subtitle {
  margin: 0;
  font-size: 14px;
  color: #718096;
}

.period-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
}

.chart-placeholder {
  height: 280px;
  padding: 20px 24px;
  position: relative;
}

.chart-bars {
  display: flex;
  height: 200px;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 10px;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30px;
}

.chart-bar {
  width: 100%;
  background-color: #4299e1;
  border-radius: 4px 4px 0 0;
  margin-bottom: 8px;
  transition: height 0.5s;
}

.chart-label {
  font-size: 12px;
  color: #718096;
}

/* Branch Section */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f4f8;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.view-all {
  font-size: 14px;
  color: #6b9080;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all:hover {
  color: #5a7b6c;
  text-decoration: underline;
}

.branch-cards {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 550px;
  overflow-y: auto;
}

.branch-card {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #6b9080;
}

.branch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.branch-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.status-badge {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: capitalize;
}

.status-badge.open {
  background-color: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.status-badge.busy {
  background-color: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.status-badge.closed {
  background-color: rgba(160, 174, 192, 0.1);
  color: #a0aec0;
}

.branch-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #718096;
}

.branch-footer {
  display: flex;
  justify-content: flex-end;
}

.branch-action {
  background-color: rgba(107, 144, 128, 0.1);
  color: #6b9080;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.branch-action:hover {
  background-color: rgba(107, 144, 128, 0.2);
}

/* Quick Actions Section */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px 24px;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #f8fafc;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.2s;
  color: inherit;
  text-decoration: none;
}

.action-button:hover {
  background-color: #f0f7f4;
  transform: translateY(-3px);
}

.action-button svg {
  font-size: 24px;
  color: #6b9080;
  margin-bottom: 8px;
}

.action-button span {
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr 1fr;
  }

  .chart-section {
    grid-column: span 2;
  }

  .branches-section {
    grid-column: span 2;
    grid-row: auto;
  }

  .quick-actions-section {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
  }

  .date-display {
    width: 100%;
  }

  .summary-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .dashboard-content {
    grid-template-columns: 1fr;
  }

  .chart-section,
  .branches-section,
  .quick-actions-section {
    grid-column: span 1;
  }

  .chart-header,
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

.branch-indicator {
  font-size: 0.9em;
  color: #666;
  font-weight: normal;
  margin-left: 8px;
}

.loading-container {
  padding: 40px;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
  color: #718096;
  font-size: 16px;
}
</style>
