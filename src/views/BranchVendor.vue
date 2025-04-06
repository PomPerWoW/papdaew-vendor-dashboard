<template>
  <div class="main">
    <div class="page-header">
      <div class="header-content">
        <h1>Branch Management</h1>
        <p class="description">Manage your restaurant locations and branches</p>
      </div>
      <button @click="showModal = true" class="add-button">
        <Icon icon="material-symbols:add" width="20" height="20" />
        <span>Add Branch</span>
      </button>
    </div>

    <div class="filter-container">
      <div class="search-box">
        <Icon icon="material-symbols:search" class="search-icon" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search branches..."
          class="search-input"
        />
      </div>
      <div class="filters">
        <Dropdown
          v-model="selectedType"
          :options="branchTypes"
          optionLabel="label"
          placeholder="Filter by type"
          class="filter-dropdown"
        />
        <button
          @click="clearFilters"
          class="clear-button"
          :class="{ active: isFiltering }"
        >
          <Icon icon="material-symbols:filter-alt-off" width="16" height="16" />
          Clear Filters
        </button>
      </div>
    </div>

    <p v-if="filteredBranches.length === 0" class="no-results">
      No branches found. Try changing your search criteria or add a new branch.
    </p>

    <div class="grid-layout" v-else>
      <BranchCard
        v-for="(branch, index) in filteredBranches"
        :key="index"
        :branch="branch"
        @edit="editBranch"
        @delete="confirmDelete"
      />
    </div>

    <AddBranch
      :isOpen="showModal"
      @close="showModal = false"
      @branch-added="onBranchAdded"
    />

    <ConfirmDialog
      v-model:visible="showDeleteConfirm"
      :message="`Are you sure you want to delete '${branchToDelete?.name}'?`"
      @confirm="deleteBranch"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toast-notification';
import { Icon } from '@iconify/vue';
import BranchCard from '@/components/BranchCard.vue';
import AddBranch from '@/components/AddBranch.vue';
import Dropdown from 'primevue/dropdown';
import ConfirmDialog from 'primevue/confirmdialog';

const toast = useToast();
const showModal = ref(false);
const searchQuery = ref('');
const selectedType = ref(null);
const showDeleteConfirm = ref(false);
const branchToDelete = ref(null);

// Branch types for filtering
const branchTypes = [
  { label: 'All Types', value: null },
  { label: 'Main Branch', value: 'main' },
  { label: 'Sub Branch', value: 'sub' },
  { label: 'Kiosk', value: 'kiosk' },
  { label: 'Flagship Store', value: 'flagship' },
];

// Demo data - in a real app, this would come from an API
const branches = ref([
  {
    id: 1,
    name: 'Downtown Branch',
    type: 'main',
    typeLabel: 'Main Branch',
    manager: 'John Doe',
    email: 'downtown@example.com',
    phone: '+66 123 456 789',
    address: '123 Main Street, Lat Phrao, Bangkok 10230, Thailand',
    hours: '9:00 AM - 9:00 PM',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Sukhumvit Branch',
    type: 'sub',
    typeLabel: 'Sub Branch',
    manager: 'Jane Smith',
    email: 'sukhumvit@example.com',
    phone: '+66 234 567 890',
    address: '456 Sukhumvit Road, Khlong Toei, Bangkok 10110, Thailand',
    hours: '10:00 AM - 10:00 PM',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: 'Central World Kiosk',
    type: 'kiosk',
    typeLabel: 'Kiosk',
    manager: 'Sam Wilson',
    email: 'centralworld@example.com',
    phone: '+66 345 678 901',
    address: 'Central World, 4th Floor, Pathum Wan, Bangkok 10330, Thailand',
    hours: '10:00 AM - 9:00 PM',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    name: 'Siam Paragon Flagship',
    type: 'flagship',
    typeLabel: 'Flagship Store',
    manager: 'Lisa Brown',
    email: 'siamparagon@example.com',
    phone: '+66 456 789 012',
    address: 'Siam Paragon, G Floor, Pathum Wan, Bangkok 10330, Thailand',
    hours: '10:00 AM - 10:00 PM',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60',
  },
]);

// Filter branches based on search query and selected type
const filteredBranches = computed(() => {
  let filtered = branches.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      branch =>
        branch.name.toLowerCase().includes(query) ||
        branch.manager.toLowerCase().includes(query) ||
        branch.address.toLowerCase().includes(query)
    );
  }

  if (selectedType.value) {
    filtered = filtered.filter(branch => branch.type === selectedType.value);
  }

  return filtered;
});

// Check if any filter is active
const isFiltering = computed(() => {
  return searchQuery.value.length > 0 || selectedType.value !== null;
});

// Clear all filters
const clearFilters = () => {
  searchQuery.value = '';
  selectedType.value = null;
};

// Branch CRUD operations
const onBranchAdded = branch => {
  // In a real app, this would be an API call followed by a refresh
  const newBranch = {
    id: branches.value.length + 1,
    ...branch,
    typeLabel:
      branchTypes.find(t => t.value === branch.type)?.label || branch.type,
  };
  branches.value.push(newBranch);
  toast.success(`${branch.name} has been added successfully!`);
};

const editBranch = branch => {
  // In a real app, this would open an edit modal
  toast.info(`Editing ${branch.name}`);
};

const confirmDelete = branch => {
  branchToDelete.value = branch;
  showDeleteConfirm.value = true;
};

const deleteBranch = () => {
  if (!branchToDelete.value) return;

  // In a real app, this would be an API call
  branches.value = branches.value.filter(b => b.id !== branchToDelete.value.id);
  toast.success(`${branchToDelete.value.name} has been deleted successfully!`);
  branchToDelete.value = null;
};
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

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #5a7b6c;
}

.filter-container {
  display: flex;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 20px;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #6b9080;
}

.filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filter-dropdown {
  min-width: 150px;
}

.clear-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button.active {
  border-color: #6b9080;
  color: #6b9080;
}

.clear-button:hover {
  background-color: #f5f5f5;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 15px;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .main {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }

  .filter-container {
    flex-direction: column;
  }

  .filters {
    width: 100%;
  }

  .filter-dropdown {
    flex: 1;
  }
}
</style>
