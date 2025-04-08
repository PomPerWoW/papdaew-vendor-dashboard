<template>
  <div class="card">
    <div class="card-image">
      <img
        :src="branch.image || 'https://via.placeholder.com/400x200'"
        :alt="branch.branchName || branch.name"
      />
      <div class="type-badge" :class="branch.type">
        {{ branch.typeLabel || 'Branch' }}
      </div>
      <div v-if="branch.status" class="status-badge" :class="branch.status">
        {{ formatStatus(branch.status) }}
      </div>
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3>{{ branch.branchName || branch.name }}</h3>
        <div class="branch-code">{{ branch.branchCode || 'No Code' }}</div>
        <div class="hours">
          <Icon icon="material-symbols:schedule" class="hours-icon" />
          <span>{{ formatHours(branch) }}</span>
        </div>
      </div>

      <div class="detail-row">
        <Icon icon="material-symbols:person" class="detail-icon" />
        <span
          ><strong>Manager:</strong>
          {{ branch.branchManager || branch.manager }}</span
        >
      </div>

      <div class="detail-row">
        <Icon icon="material-symbols:call" class="detail-icon" />
        <span>{{ branch.contactPhone || branch.phone }}</span>
      </div>

      <div class="detail-row">
        <Icon icon="material-symbols:mail" class="detail-icon" />
        <span>{{ branch.contactEmail || branch.email }}</span>
      </div>

      <div class="detail-row address">
        <Icon icon="material-symbols:location-on" class="detail-icon" />
        <span>{{ branch.address }}</span>
      </div>

      <div class="card-actions">
        <button class="action-btn staff" @click="$emit('add-staff', branch)">
          <Icon icon="material-symbols:person-add" width="18" height="18" />
          <span>Add Staff</span>
        </button>
        <button class="action-btn edit" @click="$emit('edit', branch)">
          <Icon icon="material-symbols:edit" width="18" height="18" />
          <span>Edit</span>
        </button>
        <button class="action-btn delete" @click="$emit('delete', branch)">
          <Icon icon="material-symbols:delete" width="18" height="18" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';

// Accept branch data as a prop
defineProps({
  branch: {
    type: Object,
    required: true,
    default: () => ({
      branchName: 'Branch Name',
      branchCode: 'BKK001',
      type: 'main',
      typeLabel: 'Main Branch',
      branchManager: 'Manager Name',
      contactEmail: 'email@example.com',
      contactPhone: '+66 123 456 789',
      address: 'Address information',
      hours: '9:00 AM - 9:00 PM',
      status: 'active',
      businessHours: [
        { day: 1, open: '09:00', close: '18:00', isClosed: false },
      ],
      image: 'https://via.placeholder.com/400x200',
    }),
  },
});

// Format status string for display
const formatStatus = status => {
  if (!status) return '';

  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'temporary-closed':
      return 'Temporarily Closed';
    case 'coming-soon':
      return 'Coming Soon';
    default:
      return status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

// Format hours string from businessHours array
const formatHours = branch => {
  // If hours string already exists, use it
  if (branch.hours) return branch.hours;

  // Otherwise, generate from businessHours
  if (
    branch.businessHours &&
    Array.isArray(branch.businessHours) &&
    branch.businessHours.length > 0
  ) {
    // Find today's hours (using current day of week)
    const today = new Date().getDay();
    const todayHours = branch.businessHours.find(h => h.day === today);

    if (todayHours) {
      if (todayHours.isClosed) return 'Closed Today';

      // Format 24h time to 12h time
      const formatTime = time => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}:${minutes} ${ampm}`;
      };

      return `${formatTime(todayHours.open)} - ${formatTime(todayHours.close)}`;
    }
  }

  return 'Hours not available';
};

// Define events that this component emits
defineEmits(['edit', 'delete', 'add-staff']);
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.card-image {
  height: 160px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background-color: #a4c3b2;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background-color: #e0e0e0;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-badge.active {
  background-color: #81c784;
  color: white;
}

.status-badge.inactive {
  background-color: #e0e0e0;
  color: #555;
}

.status-badge.temporary-closed {
  background-color: #ffb74d;
  color: white;
}

.status-badge.coming-soon {
  background-color: #64b5f6;
  color: white;
}

.type-badge.main {
  background-color: #6b9080;
}

.type-badge.sub {
  background-color: #a4c3b2;
}

.type-badge.kiosk {
  background-color: #cce3de;
  color: #333;
}

.type-badge.flagship {
  background-color: #f6bd60;
}

.card-content {
  padding: 18px;
}

.card-header {
  margin-bottom: 12px;
}

.card-header h3 {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.branch-code {
  font-size: 12px;
  color: #777;
  margin-bottom: 4px;
}

.hours {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #6b9080;
}

.hours-icon {
  font-size: 14px;
  margin-right: 4px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

.detail-icon {
  font-size: 16px;
  margin-right: 8px;
  color: #a4c3b2;
  flex-shrink: 0;
  margin-top: 2px;
}

.address {
  margin-bottom: 14px;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  border-top: 1px solid #f0f0f0;
  padding-top: 14px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn.staff {
  background-color: #e6f0f7;
  color: #4a6fa5;
}

.action-btn.staff:hover {
  background-color: #d6e6f2;
}

.action-btn.edit {
  background-color: #f0f7f4;
  color: #6b9080;
}

.action-btn.edit:hover {
  background-color: #e0efe8;
}

.action-btn.delete {
  background-color: #fff2f2;
  color: #e57373;
}

.action-btn.delete:hover {
  background-color: #ffe0e0;
}
</style>
