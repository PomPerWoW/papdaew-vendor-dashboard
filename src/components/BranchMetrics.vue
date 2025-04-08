<template>
  <div class="metrics-container">
    <h2 class="section-title">{{ title }}</h2>

    <div v-if="loading" class="loading-state">
      <p>Loading metrics...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-else class="metrics-grid">
      <!-- Total customers card -->
      <div class="metric-card">
        <div class="metric-icon customers">
          <Icon icon="material-symbols:group" />
        </div>
        <div class="metric-content">
          <div class="metric-label">Total Customers</div>
          <div class="metric-value">
            {{ metrics.totalCustomers.toLocaleString() }}
          </div>
          <div
            v-if="periodData && periodData.customers"
            class="metric-trend"
            :class="getTrendClass(periodData.customers.trend)"
          >
            <Icon :icon="getTrendIcon(periodData.customers.trend)" />
            <span>{{ periodData.customers.percentage }}%</span>
            <span class="period">vs previous {{ period }}</span>
          </div>
        </div>
      </div>

      <!-- Total queues card -->
      <div class="metric-card">
        <div class="metric-icon queues">
          <Icon icon="material-symbols:format-list-numbered" />
        </div>
        <div class="metric-content">
          <div class="metric-label">Total Queues</div>
          <div class="metric-value">
            {{ metrics.totalQueues.toLocaleString() }}
          </div>
          <div
            v-if="periodData && periodData.queues"
            class="metric-trend"
            :class="getTrendClass(periodData.queues.trend)"
          >
            <Icon :icon="getTrendIcon(periodData.queues.trend)" />
            <span>{{ periodData.queues.percentage }}%</span>
            <span class="period">vs previous {{ period }}</span>
          </div>
        </div>
      </div>

      <!-- Average wait time card -->
      <div class="metric-card">
        <div class="metric-icon wait-time">
          <Icon icon="material-symbols:timer-outline" />
        </div>
        <div class="metric-content">
          <div class="metric-label">Avg. Wait Time</div>
          <div class="metric-value">{{ formatTime(metrics.avgWaitTime) }}</div>
          <div
            v-if="periodData && periodData.waitTime"
            class="metric-trend"
            :class="getTrendClass(periodData.waitTime.trend, true)"
          >
            <Icon :icon="getTrendIcon(periodData.waitTime.trend, true)" />
            <span>{{ periodData.waitTime.percentage }}%</span>
            <span class="period">vs previous {{ period }}</span>
          </div>
        </div>
      </div>

      <!-- Average rating card -->
      <div class="metric-card">
        <div class="metric-icon rating">
          <Icon icon="material-symbols:star" />
        </div>
        <div class="metric-content">
          <div class="metric-label">Avg. Rating</div>
          <div class="metric-value">{{ metrics.avgRating.toFixed(1) }}</div>
          <div class="rating-stars">
            <Icon
              v-for="n in 5"
              :key="n"
              :icon="
                n <= Math.round(metrics.avgRating)
                  ? 'material-symbols:star'
                  : 'material-symbols:star-outline'
              "
              class="small-star"
              :class="{ filled: n <= Math.round(metrics.avgRating) }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="period-selector">
      <span>Time Period:</span>
      <div class="period-buttons">
        <button
          v-for="p in periods"
          :key="p.value"
          class="period-button"
          :class="{ active: period === p.value }"
          @click="$emit('period-changed', p.value)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Icon } from '@iconify/vue';

// Define props
const props = defineProps({
  title: {
    type: String,
    default: 'Branch Metrics',
  },
  metrics: {
    type: Object,
    default: () => ({
      totalCustomers: 0,
      totalQueues: 0,
      avgWaitTime: 0,
      avgRating: 0,
    }),
  },
  periodData: {
    type: Object,
    default: null,
  },
  period: {
    type: String,
    default: 'month',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
});

// Define emits
defineEmits(['period-changed']);

// Available periods
const periods = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

// Method to determine trend class
const getTrendClass = (trend, isInverse = false) => {
  if (!trend) return '';

  // For wait time, lower is better
  if (isInverse) {
    return trend > 0 ? 'negative' : 'positive';
  }

  return trend > 0 ? 'positive' : 'negative';
};

// Method to determine trend icon
const getTrendIcon = (trend, isInverse = false) => {
  if (!trend) return 'material-symbols:equal';

  // For wait time, lower is better
  if (isInverse) {
    return trend > 0
      ? 'material-symbols:trending-up'
      : 'material-symbols:trending-down';
  }

  return trend > 0
    ? 'material-symbols:trending-up'
    : 'material-symbols:trending-down';
};

// Format time in minutes to a readable format
const formatTime = minutes => {
  if (!minutes) return '0 mins';

  if (minutes < 60) {
    return `${Math.round(minutes)} mins`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (remainingMinutes === 0) {
    return `${hours} hrs`;
  }

  return `${hours} hrs ${remainingMinutes} mins`;
};
</script>

<style scoped>
.metrics-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 15px;
  margin: 16px 0;
}

.error-state {
  color: #e57373;
  background: #ffebee;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.metric-icon svg {
  font-size: 24px;
  color: white;
}

.metric-icon.customers {
  background-color: #4a6fa5;
}

.metric-icon.queues {
  background-color: #6b9080;
}

.metric-icon.wait-time {
  background-color: #e29578;
}

.metric-icon.rating {
  background-color: #ffbf69;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.metric-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 4px;
}

.metric-trend.positive {
  color: #4caf50;
}

.metric-trend.negative {
  color: #e57373;
}

.period {
  color: #888;
  margin-left: 4px;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.small-star {
  font-size: 16px;
  color: #ccc;
}

.small-star.filled {
  color: #ffd700;
}

.period-selector {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  border-top: 1px solid #eee;
  padding-top: 16px;
  font-size: 14px;
  color: #666;
}

.period-buttons {
  display: flex;
  margin-left: 12px;
  gap: 4px;
}

.period-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: white;
  font-size: 12px;
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

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .metric-card {
    margin-bottom: 12px;
  }

  .period-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .period-buttons {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
