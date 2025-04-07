<template>
  <div class="queue-management">
    <div class="queue-header">
      <h1>Queue Management</h1>
      <p v-if="branchName" class="branch-name">{{ branchName }} Branch</p>
      <div
        v-if="
          !userStore.isStaff || !userStore.branchId || userStore.isRootAccount
        "
        class="unauthorized-message"
      >
        <p v-if="userStore.isRootAccount">
          Root accounts cannot manage queues. Please use a branch staff account.
        </p>
        <p v-else>You need staff access to manage queues.</p>
        <router-link to="/dashboard-vendor" class="back-link"
          >Back to Dashboard</router-link
        >
      </div>
    </div>

    <div
      v-if="userStore.isStaff && userStore.branchId && !userStore.isRootAccount"
      class="queue-content"
    >
      <!-- Queue Statistics Section -->
      <div class="queue-stats-section">
        <div class="stat-card">
          <div class="stat-icon">
            <Icon icon="material-symbols:people" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ customersServedToday }}</span>
            <span class="stat-label">Customers Served Today</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Icon icon="material-symbols:schedule" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ averageWaitTime }} min</span>
            <span class="stat-label">Average Wait Time</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Icon icon="material-symbols:format-list-numbered" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ waitingQueues.length }}</span>
            <span class="stat-label">Current Queue Length</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Icon icon="material-symbols:signal-cellular-alt" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ queueEfficiency }}%</span>
            <span class="stat-label">Queue Efficiency</span>
          </div>
        </div>
      </div>

      <!-- Current Queue Status -->
      <div class="current-queue-container">
        <h2>Now Serving</h2>
        <div class="current-queue-box">{{ currentQueue || '--' }}</div>
        <div class="queue-status" :class="queueStatusClass">
          {{ queueStatus }}
        </div>
      </div>

      <!-- Queue Control Buttons -->
      <div class="queue-controls">
        <button
          @click="nextQueue"
          class="control-btn next"
          :disabled="!isActive || isLoading"
        >
          <Icon icon="material-symbols:skip-next" />
          Next
        </button>
        <button
          @click="toggleQueueStatus"
          class="control-btn toggle"
          :disabled="isLoading"
        >
          <Icon
            :icon="
              isActive
                ? 'material-symbols:pause'
                : 'material-symbols:play-arrow'
            "
          />
          {{ isActive ? 'Pause' : 'Start' }}
        </button>
        <button
          @click="resetQueue"
          class="control-btn reset"
          :disabled="isLoading"
        >
          <Icon icon="material-symbols:refresh" />
          Reset
        </button>
        <button
          @click="cancelQueue"
          class="control-btn cancel"
          :disabled="!currentQueue || isLoading"
        >
          <Icon icon="material-symbols:cancel" />
          Cancel
        </button>
      </div>

      <!-- Queue Tabs -->
      <div class="queue-tabs">
        <button
          @click="setActiveTab('current')"
          class="tab-button"
          :class="{ active: activeTab === 'current' }"
        >
          <Icon icon="material-symbols:format-list-numbered" />
          Current Queue
        </button>
        <button
          @click="setActiveTab('history')"
          class="tab-button"
          :class="{ active: activeTab === 'history' }"
        >
          <Icon icon="material-symbols:history" />
          Queue History
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Current Queue Tab -->
        <div v-if="activeTab === 'current'" class="tab-pane">
          <!-- Waiting Queue List -->
          <div class="waiting-queue-section">
            <h2>Waiting Queue</h2>
            <div v-if="waitingQueues.length === 0" class="empty-queue">
              <p>No customers waiting in queue</p>
            </div>
            <div v-else class="waiting-queue-list">
              <div
                v-for="(queue, index) in waitingQueues"
                :key="index"
                class="queue-item"
              >
                <span class="queue-number">{{ queue.queueNumber }}</span>
                <div class="queue-info">
                  <span class="customer-name">{{ queue.customerName }}</span>
                  <span class="wait-time"
                    >Waiting: {{ formatWaitTime(queue.createdAt) }}</span
                  >
                </div>
                <button @click="callQueue(queue.queueNumber)" class="call-btn">
                  <Icon icon="material-symbols:call" />
                  Call
                </button>
              </div>
            </div>
          </div>

          <!-- Add Customer to Queue -->
          <div class="add-queue-section">
            <h2>Add New Customer</h2>
            <form @submit.prevent="addCustomerToQueue" class="add-queue-form">
              <div class="form-group">
                <label for="customerName">Customer Name</label>
                <input
                  id="customerName"
                  v-model="newCustomer.name"
                  type="text"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="customerPhone">Phone Number (optional)</label>
                <input
                  id="customerPhone"
                  v-model="newCustomer.phone"
                  type="tel"
                  placeholder="Enter phone number"
                />
              </div>
              <div class="form-group">
                <label for="partySize">Party Size</label>
                <select id="partySize" v-model="newCustomer.partySize">
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                  <option value="6">6 people</option>
                  <option value="7">7+ people</option>
                </select>
              </div>
              <button
                type="submit"
                class="add-customer-btn"
                :disabled="isLoading"
              >
                <Icon icon="material-symbols:add" />
                Add to Queue
              </button>
            </form>
          </div>
        </div>

        <!-- History Tab -->
        <div v-if="activeTab === 'history'" class="tab-pane">
          <div class="history-section">
            <h2>Queue History</h2>
            <p class="history-subtitle">Showing today's queue history</p>

            <div class="history-list">
              <div class="history-header">
                <div class="history-cell time-cell">Time</div>
                <div class="history-cell number-cell">Queue</div>
                <div class="history-cell name-cell">Customer</div>
                <div class="history-cell wait-cell">Wait Time</div>
                <div class="history-cell status-cell">Status</div>
              </div>

              <div
                v-for="(item, index) in queueHistory"
                :key="index"
                class="history-row"
              >
                <div class="history-cell time-cell">
                  {{ formatDate(item.date) }}
                </div>
                <div class="history-cell number-cell">
                  {{ item.queueNumber }}
                </div>
                <div class="history-cell name-cell">
                  {{ item.customerName }}
                </div>
                <div class="history-cell wait-cell">
                  {{ item.waitTime }} min
                </div>
                <div class="history-cell status-cell">
                  <span class="status-badge" :class="item.status">
                    {{ item.status === 'completed' ? 'Served' : 'Cancelled' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useToast } from 'vue-toast-notification';
import { Icon } from '@iconify/vue';
import { useUserStore } from '../stores/counter';

const $toast = useToast();
const userStore = useUserStore();

// Branch information
const branchId = computed(() => userStore.branchId);
const branchName = ref('');

// Queue state
const currentQueue = ref(null);
const isActive = ref(false);
const queueStatus = computed(() => {
  if (!isActive.value) return 'Queue Paused';
  return 'Queue Active';
});
const queueStatusClass = computed(() => {
  return isActive.value ? 'active' : 'paused';
});
const waitingQueues = ref([]);
const newCustomer = ref({
  name: '',
  phone: '',
  partySize: '2',
});
const isLoading = ref(false);

// Queue statistics
const customersServedToday = ref(28);
const averageWaitTime = ref(12);
const queueEfficiency = ref(87);
const activeTab = ref('current');

// Queue history
const queueHistory = ref([
  {
    date: new Date(Date.now() - 15 * 60000),
    queueNumber: 'C010',
    customerName: 'Alice Johnson',
    waitTime: 8,
    status: 'completed',
  },
  {
    date: new Date(Date.now() - 25 * 60000),
    queueNumber: 'C009',
    customerName: 'David Lee',
    waitTime: 15,
    status: 'completed',
  },
  {
    date: new Date(Date.now() - 45 * 60000),
    queueNumber: 'C008',
    customerName: 'Sarah Wilson',
    waitTime: 12,
    status: 'completed',
  },
  {
    date: new Date(Date.now() - 60 * 60000),
    queueNumber: 'C007',
    customerName: 'Michael Brown',
    waitTime: 10,
    status: 'completed',
  },
  {
    date: new Date(Date.now() - 90 * 60000),
    queueNumber: 'C006',
    customerName: 'Emma Davis',
    waitTime: 20,
    status: 'cancelled',
  },
]);

// Polling interval for queue updates
let pollingInterval = null;

onMounted(async () => {
  if (!userStore.branchId) {
    // If not a branch staff, don't proceed
    return;
  }

  // Fetch branch details
  await fetchBranchDetails();

  // Fetch initial queue data
  await fetchQueueData();

  // Start polling for queue updates
  startPolling();
});

onBeforeUnmount(() => {
  // Clear polling interval when component is destroyed
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

// Start polling for queue updates
const startPolling = () => {
  // Poll every 10 seconds for queue updates
  pollingInterval = setInterval(async () => {
    await fetchQueueData();
  }, 10000);
};

// Fetch branch details
const fetchBranchDetails = async () => {
  // In a real app, this would make an API call
  console.log(`Fetching details for branch ${branchId.value}`);
  // Mock data
  branchName.value = 'Silom';
};

// Toggle active tab
const setActiveTab = tab => {
  activeTab.value = tab;
};

// Fetch queue data
const fetchQueueData = async () => {
  // In a real app, this would make an API call
  try {
    console.log(`Fetching queue data for branch ${branchId.value}`);

    // Mock data
    currentQueue.value = 'C011';
    isActive.value = true;

    // Mock waiting queue data
    waitingQueues.value = [
      {
        queueNumber: 'C012',
        customerName: 'John Smith',
        createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
        partySize: 2,
      },
      {
        queueNumber: 'C013',
        customerName: 'Mary Johnson',
        createdAt: new Date(Date.now() - 10 * 60000), // 10 minutes ago
        partySize: 4,
      },
      {
        queueNumber: 'C014',
        customerName: 'Robert Brown',
        createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
        partySize: 3,
      },
    ];
  } catch (error) {
    console.error('Error fetching queue data:', error);
    $toast.error('Failed to load queue data');
  }
};

// Format wait time
const formatWaitTime = createdAt => {
  const now = new Date();
  const waitTime = Math.floor((now - new Date(createdAt)) / (1000 * 60)); // in minutes

  if (waitTime < 1) return 'Just now';
  if (waitTime === 1) return '1 minute';
  return `${waitTime} minutes`;
};

// Format date for history
const formatDate = date => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Queue control functions
const nextQueue = async () => {
  isLoading.value = true;
  try {
    // In a real app, this would make an API call
    console.log('Moving to next customer in queue');

    // Mock next queue behavior
    if (waitingQueues.value.length > 0) {
      currentQueue.value = waitingQueues.value[0].queueNumber;
      waitingQueues.value.shift();
      $toast.success('Called next customer');
    } else {
      currentQueue.value = null;
      $toast.info('No more customers in queue');
    }
  } catch (error) {
    console.error('Error moving to next queue:', error);
    $toast.error('Failed to move to next customer');
  } finally {
    isLoading.value = false;
  }
};

const toggleQueueStatus = async () => {
  isLoading.value = true;
  try {
    // In a real app, this would make an API call
    console.log(`${isActive.value ? 'Pausing' : 'Starting'} queue`);

    // Toggle queue status
    isActive.value = !isActive.value;

    $toast.success(`Queue ${isActive.value ? 'started' : 'paused'}`);
  } catch (error) {
    console.error('Error toggling queue status:', error);
    $toast.error('Failed to update queue status');
  } finally {
    isLoading.value = false;
  }
};

const resetQueue = async () => {
  // Confirm reset
  if (
    !confirm(
      'Are you sure you want to reset the queue? This will clear all waiting customers.'
    )
  ) {
    return;
  }

  isLoading.value = true;
  try {
    // In a real app, this would make an API call
    console.log('Resetting queue');

    // Reset queue
    currentQueue.value = null;
    waitingQueues.value = [];
    isActive.value = false;

    $toast.success('Queue has been reset');
  } catch (error) {
    console.error('Error resetting queue:', error);
    $toast.error('Failed to reset queue');
  } finally {
    isLoading.value = false;
  }
};

const cancelQueue = async () => {
  if (!currentQueue.value) return;

  // Confirm cancel
  if (
    !confirm(
      `Are you sure you want to cancel the current queue (${currentQueue.value})?`
    )
  ) {
    return;
  }

  isLoading.value = true;
  try {
    // In a real app, this would make an API call
    console.log(`Cancelling current queue: ${currentQueue.value}`);

    // Cancel current queue
    currentQueue.value = null;

    $toast.success('Current queue cancelled');
  } catch (error) {
    console.error('Error cancelling queue:', error);
    $toast.error('Failed to cancel queue');
  } finally {
    isLoading.value = false;
  }
};

const callQueue = async queueNumber => {
  isLoading.value = true;
  try {
    // In a real app, this would make an API call
    console.log(`Calling queue number: ${queueNumber}`);

    // Find and remove the queue from waiting list
    const index = waitingQueues.value.findIndex(
      q => q.queueNumber === queueNumber
    );
    if (index !== -1) {
      const queue = waitingQueues.value[index];
      waitingQueues.value.splice(index, 1);

      // Update current queue
      currentQueue.value = queueNumber;

      $toast.success(`Called ${queue.customerName} (${queueNumber})`);
    }
  } catch (error) {
    console.error('Error calling queue:', error);
    $toast.error('Failed to call queue');
  } finally {
    isLoading.value = false;
  }
};

const addCustomerToQueue = async () => {
  isLoading.value = true;
  try {
    // In a real app, this would make an API call
    console.log('Adding customer to queue:', newCustomer.value);

    // Generate a new queue number
    const nextQueueNumber = generateQueueNumber();

    // Add to waiting queue
    waitingQueues.value.push({
      queueNumber: nextQueueNumber,
      customerName: newCustomer.value.name,
      createdAt: new Date(),
      partySize: parseInt(newCustomer.value.partySize),
    });

    // Reset form
    newCustomer.value = {
      name: '',
      phone: '',
      partySize: '2',
    };

    $toast.success(`Added ${nextQueueNumber} to queue`);
  } catch (error) {
    console.error('Error adding customer to queue:', error);
    $toast.error('Failed to add customer to queue');
  } finally {
    isLoading.value = false;
  }
};

// Helper function to generate a new queue number
const generateQueueNumber = () => {
  // In a real app, this would be generated by the backend
  const prefix = 'C';
  const last =
    waitingQueues.value.length > 0
      ? parseInt(
          waitingQueues.value[
            waitingQueues.value.length - 1
          ].queueNumber.substring(1)
        )
      : parseInt(currentQueue.value?.substring(1) || '0');
  const next = (last + 1).toString().padStart(3, '0');
  return `${prefix}${next}`;
};
</script>

<style scoped>
.queue-management {
  padding: 32px;
}

.queue-header {
  margin-bottom: 32px;
  position: relative;
}

.queue-header h1 {
  font-weight: 600;
  margin-bottom: 8px;
}

.branch-name {
  color: #666;
  font-size: 16px;
}

.unauthorized-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin-top: 24px;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #0056b3;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.queue-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* Queue Statistics Styles */
.queue-stats-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(107, 144, 128, 0.1);
  color: #6b9080;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
}

/* Queue Tabs Styles */
.queue-tabs {
  grid-column: 1 / -1;
  display: flex;
  background-color: white;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-button {
  flex: 1;
  padding: 16px;
  border: none;
  background-color: white;
  color: #718096;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: #6b9080;
  border-bottom: 2px solid #6b9080;
}

.tab-button:hover:not(.active) {
  background-color: #f9f9f9;
}

.tab-content {
  grid-column: 1 / -1;
}

.tab-pane {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* History Tab Styles */
.history-section {
  grid-column: 1 / -1;
  background-color: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.history-subtitle {
  color: #718096;
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 24px;
}

.history-list {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #edf2f7;
}

.history-header {
  display: flex;
  background-color: #f8fafc;
  font-weight: 600;
  color: #4a5568;
  font-size: 14px;
}

.history-row {
  display: flex;
  border-top: 1px solid #edf2f7;
}

.history-cell {
  padding: 12px 16px;
  flex: 1;
  display: flex;
  align-items: center;
}

.time-cell {
  flex: 0 0 120px;
}

.number-cell {
  flex: 0 0 100px;
}

.name-cell {
  flex: 1;
}

.wait-cell {
  flex: 0 0 100px;
  justify-content: center;
}

.status-cell {
  flex: 0 0 120px;
  justify-content: center;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background-color: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.status-badge.cancelled {
  background-color: rgba(245, 101, 101, 0.1);
  color: #f56565;
}

.current-queue-container {
  grid-column: 1 / -1;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
  text-align: center;
}

.current-queue-container h2 {
  margin-bottom: 16px;
  font-weight: 500;
}

.current-queue-box {
  font-size: 128px;
  font-weight: 700;
  color: #333;
  margin: 16px 0;
  line-height: 1.2;
}

.queue-status {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  margin-top: 16px;
}

.queue-status.active {
  background-color: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.queue-status.paused {
  background-color: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.queue-controls {
  grid-column: 1 / -1;
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.control-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.control-btn.next {
  background-color: #6b9080;
  color: white;
}

.control-btn.toggle {
  background-color: #fca311;
  color: white;
}

.control-btn.reset {
  background-color: #4a5568;
  color: white;
}

.control-btn.cancel {
  background-color: #e53e3e;
  color: white;
}

.waiting-queue-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.waiting-queue-section h2 {
  margin-bottom: 16px;
  font-weight: 500;
}

.empty-queue {
  text-align: center;
  padding: 32px 0;
  color: #666;
}

.waiting-queue-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.queue-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.queue-number {
  font-size: 28px;
  font-weight: 700;
  margin-right: 16px;
  min-width: 80px;
  text-align: center;
}

.queue-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name {
  font-weight: 500;
}

.wait-time {
  font-size: 14px;
  color: #666;
}

.call-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-queue-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.add-queue-section h2 {
  margin-bottom: 16px;
  font-weight: 500;
}

.add-queue-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.add-customer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .queue-stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .queue-content {
    grid-template-columns: 1fr;
  }

  .tab-pane {
    grid-template-columns: 1fr;
  }

  .queue-controls {
    flex-direction: column;
  }

  .queue-stats-section {
    grid-template-columns: 1fr;
  }
}
</style>
