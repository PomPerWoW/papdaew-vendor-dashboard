<template>
  <div class="main">
    <div class="page-header">
      <div class="header-content">
        <h1>Branch Management</h1>
        <p class="description">Manage your restaurant locations and branches</p>
      </div>
      <div class="button-group">
        <button @click="addBranchStaff" class="staff-button">
          <Icon icon="material-symbols:person-add" width="20" height="20" />
          <span>Add Staff</span>
        </button>
        <button @click="showModal = true" class="add-button">
          <Icon icon="material-symbols:add" width="20" height="20" />
          <span>Add Branch</span>
        </button>
      </div>
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

    <div v-if="loading" class="loading-state">
      <p>Loading branches...</p>
    </div>

    <p v-else-if="filteredBranches.length === 0" class="no-results">
      No branches found. Try changing your search criteria or add a new branch.
    </p>

    <div class="grid-layout" v-else>
      <BranchCard
        v-for="(branch, index) in filteredBranches"
        :key="branch.id || index"
        :branch="branch"
        @edit="editBranch"
        @delete="confirmDelete"
        @add-staff="addStaffToBranch"
      />
    </div>

    <AddBranch
      :isOpen="showModal"
      @close="showModal = false"
      @branch-added="onBranchAdded"
    />

    <ConfirmDialog
      v-model:visible="showDeleteConfirm"
      :message="`Are you sure you want to delete '${branchToDelete?.branchName}'?`"
      @confirm="deleteBranch"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import BranchCard from '@/components/BranchCard.vue';
import AddBranch from '@/components/AddBranch.vue';
import Dropdown from 'primevue/dropdown';
import ConfirmDialog from 'primevue/confirmdialog';
import {
  addBranch,
  getBranches,
  getCurrentUser,
  createLocation,
} from '@/lib/api';

const router = useRouter();
const toast = useToast();
const showModal = ref(false);
const searchQuery = ref('');
const selectedType = ref(null);
const showDeleteConfirm = ref(false);
const branchToDelete = ref(null);
const loading = ref(true);
const branches = ref([]);
const currentUser = ref(null);
const vendorId = ref(null);

// Branch types for filtering
const branchTypes = [
  { label: 'All Types', value: null },
  { label: 'Main Branch', value: 'main' },
  { label: 'Sub Branch', value: 'sub' },
  { label: 'Kiosk', value: 'kiosk' },
  { label: 'Flagship Store', value: 'flagship' },
];

// Load branches when component mounts
onMounted(async () => {
  try {
    // Get current user and vendor information
    const userResponse = await getCurrentUser();
    currentUser.value = userResponse.data;

    if (currentUser.value && currentUser.value.staff) {
      vendorId.value = currentUser.value.staff.vendorId;

      // Fetch branches for this vendor
      await fetchBranches();
    } else {
      toast.error('No vendor information found for current user');
      loading.value = false;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    toast.error('Failed to load user data');
    loading.value = false;
  }
});

// Fetch branches from API
const fetchBranches = async () => {
  try {
    loading.value = true;

    if (vendorId.value) {
      // Call the API to get branches
      const response = await getBranches(vendorId.value);
      branches.value = response.data;
    } else {
      toast.error('Vendor ID is missing');
      branches.value = [];
    }

    loading.value = false;
  } catch (error) {
    console.error('Error fetching branches:', error);
    toast.error('Failed to load branches');
    loading.value = false;
    branches.value = [];
  }
};

// Filter branches based on search query and selected type
const filteredBranches = computed(() => {
  let filtered = branches.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      branch =>
        branch.branchName.toLowerCase().includes(query) ||
        branch.manager?.toLowerCase().includes(query) ||
        branch.address?.toLowerCase().includes(query)
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
const onBranchAdded = async branch => {
  try {
    loading.value = true;
    console.log('Adding branch with data:', branch);

    let locationId = branch.locationId;

    // If we need to create a location first (address is provided but locationId is a placeholder)
    if (
      branch.addressLine1 &&
      (!locationId || locationId === '000000000000000000000000')
    ) {
      // Create location data object with proper structure
      const locationData = {
        name: branch.name, // Use branch name as location name
        addressLine1: branch.addressLine1,
        addressLine2: branch.addressLine2 || '',
        district: branch.district || 'Unknown District',
        subdistrict: branch.subdistrict || 'Unknown Subdistrict',
        province: branch.province || 'Bangkok',
        postalCode: branch.postalCode || '10000',
        country: 'Thailand',
        type: 'STANDALONE',
        coordinates: {
          latitude: 13.7563, // Default Bangkok coordinates
          longitude: 100.5018,
        },
      };

      console.log('Creating location with data:', locationData);

      // Create the location
      try {
        const locationResponse = await createLocation(locationData);
        locationId = locationResponse.data.id;
        console.log('Location created successfully with ID:', locationId);
        toast.success(`Location created successfully`);
      } catch (error) {
        console.error('Error creating location:', error);
        toast.error('Failed to create location. Using placeholder ID.');
        // Continue with placeholder ID if location creation fails
      }
    }

    // Prepare branch data according to API requirements
    const branchData = {
      branchName: branch.name,
      branchCode:
        branch.branchCode ||
        branch.name.substring(0, 3).toUpperCase() +
          Math.floor(Math.random() * 1000),
      locationId: locationId,
      contactPhone: branch.phone,
      contactEmail: branch.email,
      branchManager: branch.manager,
      businessHours: branch.businessHours,
      status: branch.status || 'active',
    };

    console.log('Sending branch data to API:', branchData);

    if (vendorId.value) {
      // Call the API to add a branch
      const response = await addBranch(vendorId.value, branchData);
      console.log('Branch added successfully, response:', response.data);

      // Add the new branch to the list with the returned data
      branches.value.push(response.data);

      toast.success(`${branch.name} has been added successfully!`);
    } else {
      toast.error('Vendor ID is missing');
    }

    loading.value = false;
  } catch (error) {
    console.error('Error adding branch:', error);
    toast.error(error.response?.data?.message || 'Failed to add branch');
    loading.value = false;
  }
};

const editBranch = branch => {
  // In a real app, this would open an edit modal
  toast.info(`Editing ${branch.branchName}`);
};

const confirmDelete = branch => {
  branchToDelete.value = branch;
  showDeleteConfirm.value = true;
};

const deleteBranch = () => {
  if (!branchToDelete.value) return;

  // In a real app, this would be an API call
  branches.value = branches.value.filter(b => b.id !== branchToDelete.value.id);
  toast.success(
    `${branchToDelete.value.branchName} has been deleted successfully!`
  );
  branchToDelete.value = null;
};

// Add function to navigate to branch staff signup
const addBranchStaff = () => {
  if (branches.value.length === 0) {
    toast.error('You need to create at least one branch first');
    return;
  }

  // For simplicity, we'll use the first branch as the default
  // In a real app, you might want to show a dialog to select which branch
  const defaultBranch = branches.value[0];

  router.push({
    path: '/branch-staff-signup',
    query: { branchId: defaultBranch.id },
  });
};

// Function to navigate to staff signup for a specific branch
const addStaffToBranch = branch => {
  if (!branch || !branch.id) {
    toast.error('Invalid branch selected');
    return;
  }

  router.push({
    path: '/branch-staff-signup',
    query: { branchId: branch.id },
  });
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

.button-group {
  display: flex;
  gap: 10px;
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

.staff-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.staff-button:hover {
  background-color: #3c5a84;
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

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 15px;
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

  .button-group {
    width: 100%;
    flex-direction: column;
  }

  .add-button,
  .staff-button {
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
