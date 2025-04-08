<template>
  <div class="queue-management">
    <div class="queue-header">
      <h1>Queue Management</h1>
      <p v-if="branchName" class="branch-name">{{ branchName }} Branch</p>

      <!-- Add queue selector dropdown -->
      <div
        class="queue-selector"
        v-if="
          userStore.isStaff && userStore.branchId && !userStore.isRootAccount
        "
      >
        <div class="queue-selection-row">
          <div class="queue-dropdown">
            <label for="queue-select">Select Queue:</label>
            <select
              id="queue-select"
              v-model="selectedQueueId"
              @change="handleQueueChange"
              :disabled="isLoading"
            >
              <option disabled value="">Select a queue to manage</option>
              <option v-for="queue in queues" :key="queue.id" :value="queue.id">
                {{ queue.name }}
              </option>
            </select>
            <button
              @click="refreshQueues"
              class="refresh-btn"
              :disabled="isLoading"
              title="Refresh Queues"
            >
              <Icon icon="material-symbols:refresh" />
            </button>
          </div>
          <button
            @click="showCreateQueueModal = true"
            class="create-btn"
            :disabled="isLoading"
            title="Create New Queue"
          >
            <Icon icon="material-symbols:add" />
            New Queue
          </button>
        </div>
      </div>

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
            <Icon icon="mdi:account-multiple" />
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
                  <div class="queue-details">
                    <span class="wait-time">
                      <Icon
                        icon="material-symbols:timer-outline"
                        class="info-icon"
                      />
                      Waiting: {{ formatWaitTime(queue.createdAt) }}
                    </span>
                    <span class="party-size">
                      <Icon icon="material-symbols:group" class="info-icon" />
                      Party: {{ queue.partySize }}
                      {{ queue.partySize === 1 ? 'person' : 'people' }}
                    </span>
                    <span class="est-time">
                      <Icon
                        icon="material-symbols:schedule"
                        class="info-icon"
                      />
                      Est. wait:
                      {{
                        queue.estimatedWaitTime ||
                        Math.round(averageWaitTime.value)
                      }}
                      min
                    </span>
                  </div>
                </div>
                <div class="queue-actions">
                  <button
                    @click="callQueue(queue.queueNumber)"
                    class="call-btn"
                  >
                    <Icon icon="material-symbols:call" />
                    Call
                  </button>
                  <button
                    @click="cancelWaitingCustomer(queue.id, queue.queueNumber)"
                    class="cancel-wait-btn"
                  >
                    <Icon icon="material-symbols:close" />
                  </button>
                </div>
              </div>
            </div>
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

    <!-- Create Queue Modal -->
    <div
      class="modal-overlay"
      v-if="showCreateQueueModal"
      @click="showCreateQueueModal = false"
    >
      <div class="modal-content" @click.stop>
        <h2>Create New Queue</h2>
        <div class="modal-form">
          <div class="form-group">
            <label for="queueName">Queue Name</label>
            <input
              id="queueName"
              v-model="newQueue.name"
              type="text"
              placeholder="e.g., Main Counter, Fast Track, VIP"
              required
            />
          </div>
          <div class="form-group">
            <label for="queueDescription">Description (optional)</label>
            <textarea
              id="queueDescription"
              v-model="newQueue.description"
              placeholder="Brief description of this queue"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="queueStatus">Initial Status</label>
            <select id="queueStatus" v-model="newQueue.status">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          <div class="form-actions">
            <button
              class="cancel-btn"
              @click="showCreateQueueModal = false"
              :disabled="isCreatingQueue"
            >
              Cancel
            </button>
            <button
              class="create-btn"
              @click="createNewQueue"
              :disabled="!newQueue.name || isCreatingQueue"
            >
              <Icon icon="material-symbols:add" />
              Create Queue
            </button>
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
import {
  getQueuesByVendor,
  getQueueStatus,
  updateQueue,
  dequeueCustomer,
  createQueue,
  exitQueue,
} from '../lib/api';

const $toast = useToast();
const userStore = useUserStore();

// Branch ID from the user store (for branch staff)
const vendorId = computed(() => userStore.user?.data?.staff?.vendorId);
const branchName = ref('');

// Queue state
const selectedQueueId = ref('');
const queues = ref([]);
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
const isLoading = ref(false);

// Queue statistics
const customersServedToday = ref(0);
const averageWaitTime = ref(0);
const queueEfficiency = ref(0);
const activeTab = ref('current');

// Queue history
const queueHistory = ref([]);

// Polling interval for queue updates
let pollingInterval = null;

// Create Queue Modal
const showCreateQueueModal = ref(false);
const newQueue = ref({
  name: '',
  description: '',
  status: 'active',
});
const isCreatingQueue = ref(false);

onMounted(async () => {
  if (!userStore.branchId || !vendorId.value) {
    // If not a branch staff, don't proceed
    return;
  }

  // Fetch branch details
  await fetchBranchDetails();

  // Fetch available queues
  await fetchQueues();

  // Start polling for queue updates if a queue is selected
  if (selectedQueueId.value) {
    startPolling();
  }
});

onBeforeUnmount(() => {
  // Clear polling interval when component is destroyed
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

// Start polling for queue updates
const startPolling = () => {
  // Clear existing polling interval if any
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }

  // Poll every 10 seconds for queue updates
  pollingInterval = setInterval(async () => {
    if (selectedQueueId.value) {
      await fetchQueueData();
    }
  }, 10000);
};

// Fetch branch details
const fetchBranchDetails = async () => {
  try {
    // Get branch info from user store
    const branch = userStore.branchData;
    branchName.value = branch?.branchName || 'Current';
  } catch (error) {
    console.error('Error fetching branch details:', error);
    $toast.error('Failed to load branch details');
  }
};

// Fetch available queues
const fetchQueues = async () => {
  isLoading.value = true;
  try {
    const response = await getQueuesByVendor(vendorId.value);
    queues.value = response.data.queues || [];

    // Select first queue by default if available and none is selected
    if (queues.value.length > 0 && !selectedQueueId.value) {
      selectedQueueId.value = queues.value[0].id;
      await fetchQueueData();
      startPolling();
    }

    if (queues.value.length === 0) {
      $toast.info('No queues available for this branch');
    }
  } catch (error) {
    console.error('Error fetching queues:', error);
    $toast.error('Failed to load queues');
  } finally {
    isLoading.value = false;
  }
};

// Refresh queues list
const refreshQueues = async () => {
  await fetchQueues();
  $toast.success('Queues refreshed');
};

// Handle queue selection change
const handleQueueChange = async () => {
  if (selectedQueueId.value) {
    await fetchQueueData();
    startPolling();
  }
};

// Toggle active tab
const setActiveTab = tab => {
  activeTab.value = tab;
};

// Fetch queue data
const fetchQueueData = async () => {
  if (!selectedQueueId.value) return;

  isLoading.value = true;
  try {
    const response = await getQueueStatus(selectedQueueId.value);
    const data = response.data;

    // Update queue state
    const queue = data.queue;
    currentQueue.value =
      queue.currentNumber > 0
        ? `C${queue.currentNumber.toString().padStart(3, '0')}`
        : null;
    isActive.value = queue.status === 'active';

    // Update waiting queue items
    waitingQueues.value = data.items.map(item => ({
      queueNumber: `C${item.number.toString().padStart(3, '0')}`,
      customerName: extractCustomerName(item.notes) || item.userId,
      createdAt: new Date(item.joinedAt),
      partySize: extractPartySize(item.notes) || 1,
      userId: item.userId,
      id: item.id,
      estimatedWaitTime: item.estimatedWaitTime || 0,
    }));

    // Update statistics
    customersServedToday.value = data.waitingCount || 0;
    averageWaitTime.value = Math.round(queue.averageWaitTime) || 0;
    queueEfficiency.value = calculateQueueEfficiency(queue) || 85;

    // Fetch recent history - in a real app this would be part of the status API
    await fetchQueueHistory();
  } catch (error) {
    console.error('Error fetching queue data:', error);
    if (error.response?.status === 404) {
      $toast.error('Queue not found or deleted');
      selectedQueueId.value = '';
    } else {
      $toast.error('Failed to load queue data');
    }
  } finally {
    isLoading.value = false;
  }
};

// Helper function to extract customer name from notes
const extractCustomerName = notes => {
  if (!notes) return null;
  const nameMatch = notes.match(/Name: ([^,]+)/);
  return nameMatch ? nameMatch[1].trim() : null;
};

// Helper function to extract party size from notes
const extractPartySize = notes => {
  if (!notes) return 1;
  const sizeMatch = notes.match(/Party size: (\d+)/);
  return sizeMatch ? parseInt(sizeMatch[1]) : 1;
};

// Calculate queue efficiency based on wait times and served customers
const calculateQueueEfficiency = queue => {
  // This is a simplified calculation that could be replaced with real metrics
  // from the queue service in a production environment
  if (queue.averageWaitTime > 30) return 60;
  if (queue.averageWaitTime > 15) return 75;
  if (queue.averageWaitTime > 5) return 90;
  return 95;
};

// Fetch queue history data
const fetchQueueHistory = async () => {
  try {
    // In a real app, this would be a dedicated API endpoint
    // For now, we'll create mock history data based on current date
    const today = new Date();
    const mockHistory = [];

    // Generate some reasonable mock history data
    for (let i = 1; i <= 10; i++) {
      const servedTime = new Date(today);
      servedTime.setHours(today.getHours() - Math.floor(Math.random() * 8));
      servedTime.setMinutes(
        today.getMinutes() - Math.floor(Math.random() * 59)
      );

      const waitTime = 5 + Math.floor(Math.random() * 20);
      const joinedTime = new Date(servedTime);
      joinedTime.setMinutes(joinedTime.getMinutes() - waitTime);

      mockHistory.push({
        date: servedTime,
        queueNumber: `C${(i * 10).toString().padStart(3, '0')}`,
        customerName: `Customer ${i}`,
        waitTime: waitTime,
        status: Math.random() > 0.2 ? 'completed' : 'cancelled',
      });
    }

    queueHistory.value = mockHistory.sort((a, b) => b.date - a.date);

    // In the future, this would be replaced with:
    // const historyResponse = await getQueueHistory(selectedQueueId.value);
    // queueHistory.value = historyResponse.data.history;
  } catch (error) {
    console.error('Error fetching queue history:', error);
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
  if (!selectedQueueId.value) {
    $toast.warning('Please select a queue first');
    return;
  }

  isLoading.value = true;
  try {
    await dequeueCustomer(selectedQueueId.value);
    await fetchQueueData();
    $toast.success('Called next customer');
  } catch (error) {
    console.error('Error moving to next queue:', error);
    $toast.error('Failed to move to next customer');
  } finally {
    isLoading.value = false;
  }
};

const toggleQueueStatus = async () => {
  if (!selectedQueueId.value) {
    $toast.warning('Please select a queue first');
    return;
  }

  isLoading.value = true;
  try {
    const newStatus = isActive.value ? 'paused' : 'active';
    await updateQueue(selectedQueueId.value, { status: newStatus });
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
  if (!selectedQueueId.value) {
    $toast.warning('Please select a queue first');
    return;
  }

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
    // First pause the queue
    await updateQueue(selectedQueueId.value, {
      status: 'paused',
      currentNumber: 0,
    });

    // Cancel all waiting customers one by one
    const promises = waitingQueues.value.map(item =>
      exitQueue(selectedQueueId.value, item.userId).catch(error => {
        console.error(`Error removing customer ${item.queueNumber}:`, error);
        // Continue with other customers even if one fails
        return null;
      })
    );

    // Wait for all cancellations to complete
    await Promise.allSettled(promises);

    // Refresh queue data
    await fetchQueueData();

    $toast.success('Queue has been reset successfully');
  } catch (error) {
    console.error('Error resetting queue:', error);
    $toast.error('Failed to reset queue');
  } finally {
    isLoading.value = false;
  }
};

const cancelQueue = async () => {
  if (!selectedQueueId.value || !currentQueue.value) {
    $toast.warning('No active queue to cancel');
    return;
  }

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
    // In a real app, this would make a specific API call to cancel the current customer
    // For now, we'll just call nextQueue without serving
    await updateQueue(selectedQueueId.value, {
      currentNumber: Math.max(
        0,
        parseInt(currentQueue.value?.substring(1) || '0') - 1
      ),
    });
    currentQueue.value = null;
    await fetchQueueData();

    $toast.success('Current queue cancelled');
  } catch (error) {
    console.error('Error cancelling queue:', error);
    $toast.error('Failed to cancel queue');
  } finally {
    isLoading.value = false;
  }
};

const callQueue = async queue => {
  if (!selectedQueueId.value) {
    $toast.warning('Please select a queue first');
    return;
  }

  isLoading.value = true;
  try {
    // Find the queue item to call
    const queueNumber = typeof queue === 'string' ? queue : queue.queueNumber;
    const index = waitingQueues.value.findIndex(
      q => q.queueNumber === queueNumber
    );

    if (index !== -1) {
      // Get the number without the 'C' prefix and leading zeros
      const customerNumber = parseInt(queueNumber.substring(1));

      // Update the current queue number
      await updateQueue(selectedQueueId.value, {
        currentNumber: customerNumber,
        status: 'active', // Ensure queue is active when calling a customer
      });

      // Refresh queue data
      await fetchQueueData();

      $toast.success(`Called customer ${queueNumber}`);
    }
  } catch (error) {
    console.error('Error calling queue:', error);
    $toast.error('Failed to call queue');
  } finally {
    isLoading.value = false;
  }
};

const cancelWaitingCustomer = async (itemId, queueNumber) => {
  if (!selectedQueueId.value) {
    $toast.warning('Please select a queue first');
    return;
  }

  // Confirm cancel
  if (
    !confirm(
      `Are you sure you want to remove ${queueNumber} from the waiting queue?`
    )
  ) {
    return;
  }

  isLoading.value = true;
  try {
    // Get the user ID from waiting queues
    const item = waitingQueues.value.find(q => q.id === itemId);

    if (item) {
      // Call the exit queue API
      await exitQueue(selectedQueueId.value, item.userId);

      // Refresh queue data
      await fetchQueueData();

      $toast.success(`Removed ${queueNumber} from waiting queue`);
    }
  } catch (error) {
    console.error('Error cancelling waiting customer:', error);
    $toast.error('Failed to remove customer from queue');
  } finally {
    isLoading.value = false;
  }
};

const createNewQueue = async () => {
  if (!newQueue.value.name.trim()) {
    $toast.warning('Queue name is required');
    return;
  }

  isCreatingQueue.value = true;
  try {
    // Create the queue using the API
    const queueData = {
      name: newQueue.value.name,
      description: newQueue.value.description,
      status: newQueue.value.status,
      vendorId: vendorId.value,
      branchId: userStore.branchId, // Add branch ID from user store
    };

    const response = await createQueue(queueData);

    // Reset form
    newQueue.value = {
      name: '',
      description: '',
      status: 'active',
    };

    // Close modal
    showCreateQueueModal.value = false;

    // Refresh queues list
    await fetchQueues();

    // Select the newly created queue
    if (response.data && response.data.queue) {
      selectedQueueId.value = response.data.queue.id;
      await fetchQueueData();
    }

    $toast.success('New queue created successfully');
  } catch (error) {
    console.error('Error creating new queue:', error);
    $toast.error('Failed to create new queue');
  } finally {
    isCreatingQueue.value = false;
  }
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

.queue-selector {
  margin-bottom: 16px;
}

.queue-selection-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.queue-dropdown {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.queue-dropdown label {
  font-weight: 500;
  margin-right: 8px;
  white-space: nowrap;
}

.queue-dropdown select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: auto;
}

.queue-dropdown button {
  padding: 8px 16px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.create-btn {
  padding: 8px 16px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 16px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
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
  grid-column: 1 / -1;
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

.queue-details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #666;
}

.info-icon {
  font-size: 14px;
  margin-right: 4px;
  vertical-align: middle;
}

.wait-time,
.party-size,
.est-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.queue-actions {
  display: flex;
  align-items: center;
  gap: 8px;
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

.cancel-wait-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #f8f9fa;
  color: #e53e3e;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-wait-btn:hover {
  background-color: #fee2e2;
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

  .queue-selection-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .queue-dropdown {
    flex-wrap: wrap;
  }

  .queue-dropdown select {
    flex-grow: 1;
  }

  .queue-dropdown button,
  .create-btn {
    margin-left: 0;
  }

  .create-btn {
    width: 100%;
    justify-content: center;
  }

  .queue-dropdown label {
    width: 100%;
    margin-bottom: 4px;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 24px;
  font-weight: 600;
  color: #333;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.cancel-btn {
  padding: 10px 16px;
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.create-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Update existing styles for form inputs */
textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
}
</style>
