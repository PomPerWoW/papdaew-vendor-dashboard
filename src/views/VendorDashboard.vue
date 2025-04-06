<template>
  <div class="dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1>Dashboard</h1>
        <p class="welcome-message">
          Welcome back, <span class="vendor-name">Bangkok Kitchen</span>
        </p>
      </div>
      <div class="header-right">
        <div class="date-display">
          <Icon icon="material-symbols:calendar-today" />
          <span>{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card customers">
        <div class="card-icon">
          <Icon icon="material-symbols:groups" />
        </div>
        <div class="card-content">
          <h3 class="card-title">Total Customers</h3>
          <p class="card-value">1,245</p>
          <div class="card-trend positive">
            <Icon icon="material-symbols:trending-up" />
            <span>8.7% vs last month</span>
          </div>
        </div>
      </div>

      <div class="summary-card queues">
        <div class="card-icon">
          <Icon icon="material-symbols:format-list-numbered" />
        </div>
        <div class="card-content">
          <h3 class="card-title">Active Queues</h3>
          <p class="card-value">32</p>
          <div class="card-trend negative">
            <Icon icon="material-symbols:trending-down" />
            <span>3.5% vs yesterday</span>
          </div>
        </div>
      </div>

      <div class="summary-card ratings">
        <div class="card-icon">
          <Icon icon="material-symbols:star" />
        </div>
        <div class="card-content">
          <h3 class="card-title">Average Rating</h3>
          <p class="card-value">4.8<span class="rating-max">/5</span></p>
          <div class="card-trend neutral">
            <Icon icon="material-symbols:trending-flat" />
            <span>Same as last month</span>
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
            <p class="chart-subtitle">Monthly customer visits</p>
          </div>
          <div class="chart-controls">
            <select v-model="chartPeriod" class="period-select">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
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
                :style="{ height: `${value / 10}%` }"
              ></div>
              <span class="chart-label">{{ month }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Branch Status -->
      <div class="branches-section">
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
                <span>{{ branch.currentCustomers }}/{{ branch.capacity }}</span>
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
          <button class="action-button">
            <Icon icon="material-symbols:add-business" />
            <span>Add Branch</span>
          </button>
          <button class="action-button">
            <Icon icon="material-symbols:format-list-numbered" />
            <span>Manage Queues</span>
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
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

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

// Chart data
const chartPeriod = ref('month');
const monthlyCustomers = {
  Jan: 420,
  Feb: 380,
  Mar: 450,
  Apr: 400,
  May: 500,
  Jun: 550,
  Jul: 580,
  Aug: 610,
  Sep: 650,
  Oct: 682,
  Nov: 0,
  Dec: 0,
};

// Branch data
const branches = [
  {
    name: 'Silom Branch',
    status: 'active',
    currentCustomers: 45,
    capacity: 60,
    queueCount: 12,
  },
  {
    name: 'Siam Paragon',
    status: 'active',
    currentCustomers: 28,
    capacity: 40,
    queueCount: 8,
  },
  {
    name: 'Central World',
    status: 'active',
    currentCustomers: 35,
    capacity: 50,
    queueCount: 15,
  },
  {
    name: 'EmQuartier',
    status: 'maintenance',
    currentCustomers: 0,
    capacity: 45,
    queueCount: 0,
  },
];
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

.status-badge.active {
  background-color: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.status-badge.inactive {
  background-color: rgba(160, 174, 192, 0.1);
  color: #a0aec0;
}

.status-badge.maintenance {
  background-color: rgba(237, 137, 54, 0.1);
  color: #ed8936;
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
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #f0f7f4;
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
</style>
