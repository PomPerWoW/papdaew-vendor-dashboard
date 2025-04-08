<template>
  <div class="all-queues-container">
    <div class="page-header">
      <h1>Branch Queues</h1>
      <p class="subtitle">View and manage all queues for this branch</p>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-box">
        <input
          type="text"
          v-model="filters.search"
          placeholder="Search by name"
          @input="debouncedSearch"
        />
        <Icon icon="material-symbols:search" />
      </div>

      <div class="filter-options">
        <div class="filter-group">
          <label>Status:</label>
          <select v-model="filters.status" @change="loadQueues">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Sort By:</label>
          <select v-model="filters.sortBy" @change="loadQueues">
            <option value="createdAt">Created Date</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="currentNumber">Current Number</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Order:</label>
          <select v-model="filters.sortOrder" @change="loadQueues">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <button class="refresh-btn" @click="loadQueues" :disabled="isLoading">
        <Icon icon="material-symbols:refresh" /> Refresh
      </button>
    </div>

    <!-- Add New Queue Button -->
    <div class="action-bar">
      <button class="new-queue-btn" @click="createNewQueue">
        <Icon icon="material-symbols:add" /> Create New Queue
      </button>
    </div>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading-indicator">
      <Icon icon="material-symbols:hourglass" class="spin" />
      Loading queues...
    </div>

    <!-- No results message -->
    <div v-else-if="queues.length === 0" class="no-results">
      <Icon icon="material-symbols:search-off" size="48" />
      <p>No queues found matching your search criteria</p>
      <button class="clear-filters-btn" @click="clearFilters">
        Clear Filters
      </button>
    </div>

    <!-- Queues Table -->
    <div v-else class="queues-table">
      <table>
        <thead>
          <tr>
            <th>Queue Name</th>
            <th>Current #</th>
            <th>Status</th>
            <th>Wait Time</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="queue in queues" :key="queue.id">
            <td class="queue-name">{{ queue.name }}</td>
            <td class="queue-number">
              {{
                queue.currentNumber > 0
                  ? `C${queue.currentNumber.toString().padStart(3, '0')}`
                  : '-'
              }}
            </td>
            <td>
              <span class="status-badge" :class="queue.status">
                {{ formatStatus(queue.status) }}
              </span>
            </td>
            <td>{{ queue.averageWaitTime }} min</td>
            <td>{{ formatDate(queue.createdAt) }}</td>
            <td class="actions">
              <button @click="viewQueue(queue.id)" class="action-btn view">
                <Icon icon="material-symbols:visibility" />
              </button>
              <button @click="editQueue(queue.id)" class="action-btn edit">
                <Icon icon="material-symbols:edit" />
              </button>
              <button @click="confirmDelete(queue)" class="action-btn delete">
                <Icon icon="material-symbols:delete" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="pagination">
      <div class="pagination-info">
        Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
        of {{ pagination.total }} queues
      </div>
      <div class="pagination-controls">
        <button
          @click="goToPage(1)"
          :disabled="pagination.page === 1 || isLoading"
          class="page-btn"
        >
          <Icon icon="material-symbols:first-page" />
        </button>
        <button
          @click="goToPage(pagination.page - 1)"
          :disabled="pagination.page === 1 || isLoading"
          class="page-btn"
        >
          <Icon icon="material-symbols:chevron-left" />
        </button>

        <div class="page-numbers">
          <button
            v-for="pageNum in displayedPages"
            :key="pageNum"
            @click="goToPage(pageNum)"
            :class="['page-btn', { active: pageNum === pagination.page }]"
            :disabled="isLoading"
          >
            {{ pageNum }}
          </button>
        </div>

        <button
          @click="goToPage(pagination.page + 1)"
          :disabled="pagination.page === pagination.pages || isLoading"
          class="page-btn"
        >
          <Icon icon="material-symbols:chevron-right" />
        </button>
        <button
          @click="goToPage(pagination.pages)"
          :disabled="pagination.page === pagination.pages || isLoading"
          class="page-btn"
        >
          <Icon icon="material-symbols:last-page" />
        </button>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div
      v-if="showDeleteConfirm"
      class="modal-overlay"
      @click="showDeleteConfirm = false"
    >
      <div class="confirm-dialog" @click.stop>
        <h3>Delete Queue</h3>
        <p>
          Are you sure you want to delete the queue
          <strong>{{ queueToDelete?.name }}</strong
          >?
        </p>
        <p class="warning">
          This action cannot be undone. Any customers in the queue will be lost.
        </p>
        <div class="dialog-actions">
          <button
            @click="showDeleteConfirm = false"
            class="cancel-btn"
            :disabled="isDeleting"
          >
            Cancel
          </button>
          <button
            @click="deleteQueue"
            class="delete-btn"
            :disabled="isDeleting"
          >
            <Icon
              v-if="isDeleting"
              icon="material-symbols:hourglass"
              class="spin"
            />
            <Icon v-else icon="material-symbols:delete" />
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Queue Modal -->
    <div
      v-if="showCreateQueueModal"
      class="modal-overlay"
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
              @click="handleCreateQueue"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { Icon } from '@iconify/vue';
import {
  getQueuesByBranch,
  deleteQueue as deleteQueueApi,
  createQueue as createQueueApi,
} from '../lib/api';
import { useUserStore } from '../stores/counter';

const router = useRouter();
const $toast = useToast();
const userStore = useUserStore();

// State
const queues = ref([]);
const isLoading = ref(false);
const isDeleting = ref(false);
const showDeleteConfirm = ref(false);
const queueToDelete = ref(null);

// Create queue state
const showCreateQueueModal = ref(false);
const isCreatingQueue = ref(false);
const newQueue = ref({
  name: '',
  description: '',
  status: 'active',
});

// Branch ID from user store
const branchId = computed(() => userStore.branchId);

// Pagination
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 1,
});

// Filters
const filters = ref({
  search: '',
  status: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

// Computed
const displayedPages = computed(() => {
  const currentPage = pagination.value.page;
  const totalPages = pagination.value.pages;

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
});

// Debounce search
let searchTimeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadQueues();
  }, 500);
};

// Methods
const loadQueues = async () => {
  if (!branchId.value) {
    $toast.error('Branch ID not found');
    return;
  }

  isLoading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...filters.value,
    };

    const response = await getQueuesByBranch(branchId.value, params);
    queues.value = response.data.queues;
    pagination.value = response.pagination;
  } catch (error) {
    console.error('Error loading queues:', error);
    $toast.error('Failed to load queues');
  } finally {
    isLoading.value = false;
  }
};

const goToPage = page => {
  pagination.value.page = page;
  loadQueues();
};

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };
  pagination.value.page = 1;
  loadQueues();
};

const viewQueue = queueId => {
  router.push(`/queue-vendor?id=${queueId}`);
};

const editQueue = queueId => {
  router.push(`/queue-vendor?id=${queueId}&edit=true`);
};

const confirmDelete = queue => {
  queueToDelete.value = queue;
  showDeleteConfirm.value = true;
};

const deleteQueue = async () => {
  if (!queueToDelete.value) return;

  isDeleting.value = true;
  try {
    await deleteQueueApi(queueToDelete.value.id);
    $toast.success(`Queue "${queueToDelete.value.name}" has been deleted`);
    showDeleteConfirm.value = false;
    loadQueues();
  } catch (error) {
    console.error('Error deleting queue:', error);
    $toast.error('Failed to delete queue');
  } finally {
    isDeleting.value = false;
  }
};

const createNewQueue = () => {
  showCreateQueueModal.value = true;
};

const handleCreateQueue = async () => {
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
      branchId: branchId.value,
    };

    await createQueueApi(queueData);

    // Reset form
    newQueue.value = {
      name: '',
      description: '',
      status: 'active',
    };

    // Close modal
    showCreateQueueModal.value = false;

    // Refresh queues list
    await loadQueues();

    $toast.success('New queue created successfully');
  } catch (error) {
    console.error('Error creating new queue:', error);
    $toast.error('Failed to create new queue');
  } finally {
    isCreatingQueue.value = false;
  }
};

// Formatting helpers
const formatStatus = status => {
  const statusMap = {
    active: 'Active',
    paused: 'Paused',
    closed: 'Closed',
  };
  return statusMap[status] || status;
};

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Load queues on component mount
onMounted(() => {
  if (branchId.value) {
    loadQueues();
  } else {
    $toast.error('Branch ID not found');
  }
});
</script>

<style scoped>
.all-queues-container {
  padding: 32px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.filters-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.new-queue-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-box input {
  width: 100%;
  padding: 12px;
  padding-left: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.search-box .iconify {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 20px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  white-space: nowrap;
}

.filter-group select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #666;
  font-size: 16px;
  gap: 16px;
}

.spin {
  animation: spin 1.5s linear infinite;
  font-size: 32px;
  color: #6b9080;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #666;
  font-size: 16px;
  gap: 16px;
}

.clear-filters-btn {
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.queues-table {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f8fafc;
}

th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 14px;
}

td {
  padding: 16px;
  border-top: 1px solid #edf2f7;
  font-size: 14px;
}

.queue-name {
  font-weight: 500;
}

.queue-number {
  font-weight: 600;
  font-family: monospace;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background-color: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.status-badge.paused {
  background-color: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.status-badge.closed {
  background-color: rgba(160, 174, 192, 0.1);
  color: #718096;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.action-btn.view {
  background-color: rgba(66, 153, 225, 0.1);
  color: #4299e1;
}

.action-btn.edit {
  background-color: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.action-btn.delete {
  background-color: rgba(245, 101, 101, 0.1);
  color: #f56565;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.pagination-info {
  font-size: 14px;
  color: #718096;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #edf2f7;
  background-color: white;
  color: #4a5568;
  cursor: pointer;
}

.page-btn.active {
  background-color: #6b9080;
  color: white;
  border-color: #6b9080;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.modal-content,
.confirm-dialog {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 24px;
  width: 90%;
  max-width: 500px;
}

.modal-content h2,
.confirm-dialog h3 {
  margin-bottom: 16px;
  font-weight: 600;
}

.modal-form {
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
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.warning {
  color: #e53e3e;
  margin-top: 8px;
  font-size: 14px;
}

.form-actions,
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 16px;
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.create-btn,
.delete-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.create-btn {
  background-color: #6b9080;
  color: white;
}

.delete-btn {
  background-color: #e53e3e;
  color: white;
}

.create-btn:disabled,
.delete-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1024px) {
  .filters-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-box {
    width: 100%;
  }

  .filter-options {
    width: 100%;
  }

  .pagination {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .queues-table {
    overflow-x: auto;
  }

  table {
    min-width: 800px;
  }
}
</style>
