<template>
  <div class="main">
    <div class="page-header">
      <div class="header-content">
        <h1>Branch Ratings</h1>
        <p class="description">
          View and respond to customer ratings and reviews
        </p>
      </div>
      <div class="branch-selector" v-if="branches.length > 1">
        <label for="branch-select">Select Branch:</label>
        <select
          id="branch-select"
          v-model="selectedBranch"
          @change="loadRatings"
        >
          <option
            v-for="branch in branches"
            :key="branch.id"
            :value="branch.id"
          >
            {{ branch.branchName }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <p>Loading ratings...</p>
    </div>

    <div v-else class="content-wrapper">
      <!-- Rating summary -->
      <div class="ratings-summary">
        <div class="average-rating">
          <div class="rating-number">{{ averageRating }}</div>
          <div class="stars">
            <Icon
              v-for="n in 5"
              :key="n"
              :icon="
                n <= Math.round(averageRating)
                  ? 'material-symbols:star'
                  : 'material-symbols:star-outline'
              "
              class="star-icon"
              :class="{ filled: n <= Math.round(averageRating) }"
            />
          </div>
          <div class="rating-count">{{ ratingsCount }} ratings</div>
        </div>

        <div class="rating-bars">
          <div v-for="i in 5" :key="i" class="rating-bar">
            <div class="bar-label">{{ 6 - i }} stars</div>
            <div class="bar-container">
              <div
                class="bar-fill"
                :style="{
                  width: calculatePercentage(distributionMap[6 - i]) + '%',
                }"
              ></div>
            </div>
            <div class="bar-count">{{ distributionMap[6 - i] }}</div>
          </div>
        </div>
      </div>

      <!-- Rating filters -->
      <div class="rating-filters">
        <div class="filter-group">
          <button
            v-for="star in 5"
            :key="star"
            class="filter-button"
            :class="{ active: filterStar === star }"
            @click="filterRatingsByStar(star)"
          >
            {{ star }} ★
          </button>
          <button
            class="filter-button"
            :class="{ active: filterStar === null }"
            @click="filterRatingsByStar(null)"
          >
            All
          </button>
        </div>

        <div class="filter-group">
          <button
            class="filter-button"
            :class="{ active: filterResponded === true }"
            @click="filterRatingsByResponded(true)"
          >
            Responded
          </button>
          <button
            class="filter-button"
            :class="{ active: filterResponded === false }"
            @click="filterRatingsByResponded(false)"
          >
            Needs Response
          </button>
          <button
            class="filter-button"
            :class="{ active: filterResponded === null }"
            @click="filterRatingsByResponded(null)"
          >
            All
          </button>
        </div>
      </div>

      <!-- Reviews list -->
      <div v-if="filteredReviews.length === 0" class="no-reviews">
        <p>
          No reviews match your current filters. Try changing your filter
          criteria.
        </p>
      </div>

      <div v-else class="reviews-list">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="review-card"
        >
          <div class="review-header">
            <div class="rating-stars">
              <Icon
                v-for="n in 5"
                :key="n"
                :icon="
                  n <= review.rating
                    ? 'material-symbols:star'
                    : 'material-symbols:star-outline'
                "
                class="star-icon"
                :class="{ filled: n <= review.rating }"
              />
              <span class="rating-value">{{ review.rating }}</span>
            </div>
            <div class="review-date">{{ formatDate(review.date) }}</div>
          </div>

          <div class="review-comment">
            {{ review.comment || 'No comment provided' }}
          </div>

          <div v-if="review.staffResponse" class="staff-response">
            <div class="response-header">
              <Icon icon="material-symbols:comment" class="response-icon" />
              <span>Your response</span>
              <span class="response-date">{{
                formatDate(review.staffResponse.date)
              }}</span>
            </div>
            <div class="response-content">
              {{ review.staffResponse.comment }}
            </div>
          </div>

          <div v-else class="response-form">
            <textarea
              v-model="responseText[review.id]"
              placeholder="Write a response to this review..."
              rows="2"
              class="response-input"
            ></textarea>
            <button
              class="respond-button"
              @click="submitResponse(review.id)"
              :disabled="!responseText[review.id]"
            >
              Respond
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="pagination">
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>
        <div class="page-numbers">
          <button
            v-for="page in paginationPages"
            :key="page"
            class="page-number"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        <button
          class="pagination-button"
          :disabled="currentPage === pagination.pages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { Icon } from '@iconify/vue';
import { useUserStore } from '../stores/counter.js';
import { getBranches, getBranchRatings, respondToRating } from '../lib/api.js';

const userStore = useUserStore();
const toast = useToast();

// State
const loading = ref(true);
const branches = ref([]);
const selectedBranch = ref(null);
const reviews = ref([]);
const ratings = ref({
  average: 0,
  count: 0,
  distribution: {
    five: 0,
    four: 0,
    three: 0,
    two: 0,
    one: 0,
  },
});
const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  pages: 1,
});
const currentPage = ref(1);
const responseText = ref({});
const filterStar = ref(null);
const filterResponded = ref(null);

// Computed properties
const averageRating = computed(() => {
  return ratings.value.average.toFixed(1);
});

const ratingsCount = computed(() => {
  return ratings.value.count;
});

const distributionMap = computed(() => {
  return {
    5: ratings.value.distribution.five || 0,
    4: ratings.value.distribution.four || 0,
    3: ratings.value.distribution.three || 0,
    2: ratings.value.distribution.two || 0,
    1: ratings.value.distribution.one || 0,
  };
});

const filteredReviews = computed(() => {
  return reviews.value.filter(review => {
    // Filter by star rating
    if (filterStar.value !== null && review.rating !== filterStar.value) {
      return false;
    }

    // Filter by response status
    if (filterResponded.value === true && !review.staffResponse) {
      return false;
    }

    if (filterResponded.value === false && review.staffResponse) {
      return false;
    }

    return true;
  });
});

const paginationPages = computed(() => {
  const totalPages = pagination.value.pages;
  const currentPageVal = currentPage.value;

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Show first page, last page, current page, and one page on each side of current
  let pages = [1];

  if (currentPageVal > 3) {
    pages.push('...');
  }

  // Pages around current
  const start = Math.max(2, currentPageVal - 1);
  const end = Math.min(totalPages - 1, currentPageVal + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPageVal < totalPages - 2) {
    pages.push('...');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
});

// Methods
const loadBranches = async () => {
  try {
    loading.value = true;
    const vendorId = userStore.user.data.staff.vendorId;

    const response = await getBranches(vendorId);
    branches.value = response.data;

    // If user is a branch staff (non-root), they can only see their assigned branch
    if (!userStore.isRootAccount && userStore.branchId) {
      selectedBranch.value = userStore.branchId;
    } else if (branches.value.length > 0) {
      selectedBranch.value = branches.value[0].id;
    }

    if (selectedBranch.value) {
      await loadRatings();
    } else {
      loading.value = false;
    }
  } catch (error) {
    console.error('Error loading branches:', error);
    toast.error('Failed to load branches');
    loading.value = false;
  }
};

const loadRatings = async () => {
  try {
    if (!selectedBranch.value) return;

    loading.value = true;
    currentPage.value = 1;

    const vendorId = userStore.user.data.staff.vendorId;
    const response = await getBranchRatings(
      vendorId,
      selectedBranch.value,
      currentPage.value,
      10
    );

    if (response.status === 'success') {
      ratings.value = response.data.ratings;
      reviews.value = response.data.reviews;
      pagination.value = response.data.pagination;
    }

    loading.value = false;
  } catch (error) {
    console.error('Error loading ratings:', error);
    toast.error('Failed to load ratings');
    loading.value = false;
  }
};

const goToPage = async page => {
  if (page === '...') return;

  try {
    loading.value = true;
    currentPage.value = page;

    const vendorId = userStore.user.data.staff.vendorId;
    const response = await getBranchRatings(
      vendorId,
      selectedBranch.value,
      currentPage.value,
      10
    );

    if (response.status === 'success') {
      reviews.value = response.data.reviews;
      pagination.value = response.data.pagination;
    }

    loading.value = false;
  } catch (error) {
    console.error('Error loading page:', error);
    toast.error('Failed to load page');
    loading.value = false;
  }
};

const formatDate = dateString => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const calculatePercentage = value => {
  if (!value || !ratings.value.count) return 0;
  return (value / ratings.value.count) * 100;
};

const submitResponse = async reviewId => {
  if (!responseText.value[reviewId]) {
    toast.error('Response cannot be empty');
    return;
  }

  try {
    const vendorId = userStore.user.data.staff.vendorId;
    const response = await respondToRating(
      vendorId,
      selectedBranch.value,
      reviewId,
      responseText.value[reviewId]
    );

    if (response.status === 'success') {
      // Update the review in the list
      const index = reviews.value.findIndex(r => r.id === reviewId);
      if (index !== -1) {
        reviews.value[index].staffResponse = response.data.staffResponse;
      }

      // Clear response text
      responseText.value[reviewId] = '';

      toast.success('Response submitted successfully');
    }
  } catch (error) {
    console.error('Error submitting response:', error);
    toast.error('Failed to submit response');
  }
};

const filterRatingsByStar = star => {
  filterStar.value = star;
};

const filterRatingsByResponded = responded => {
  filterResponded.value = responded;
};

// Lifecycle hooks
onMounted(() => {
  loadBranches();
});
</script>

<style scoped>
.main {
  padding: 30px;
  max-width: 1200px;
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

.branch-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.branch-selector label {
  font-size: 14px;
  color: #555;
}

.branch-selector select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 14px;
  color: #333;
  min-width: 180px;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 15px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Ratings Summary */
.ratings-summary {
  display: flex;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
  gap: 40px;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 140px;
}

.rating-number {
  font-size: 48px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.stars {
  display: flex;
  margin: 12px 0;
}

.star-icon {
  font-size: 24px;
  color: #ccc;
}

.star-icon.filled {
  color: #ffd700;
}

.rating-count {
  font-size: 14px;
  color: #777;
}

.rating-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.bar-label {
  width: 60px;
  font-size: 14px;
  color: #555;
}

.bar-container {
  flex: 1;
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background-color: #6b9080;
  border-radius: 6px;
}

.bar-count {
  width: 40px;
  text-align: right;
  font-size: 14px;
  color: #555;
}

/* Rating Filters */
.rating-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: white;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button:hover {
  background-color: #f5f5f5;
}

.filter-button.active {
  background-color: #6b9080;
  color: white;
  border-color: #6b9080;
}

/* Reviews List */
.no-reviews {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 15px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.rating-stars {
  display: flex;
  align-items: center;
}

.rating-stars .star-icon {
  font-size: 18px;
}

.rating-value {
  margin-left: 8px;
  font-weight: 600;
  color: #333;
}

.review-date {
  font-size: 13px;
  color: #777;
}

.review-comment {
  font-size: 15px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 16px;
}

.staff-response {
  background-color: #f0f7f4;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.response-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}

.response-icon {
  color: #6b9080;
}

.response-date {
  margin-left: auto;
  font-size: 12px;
  color: #777;
}

.response-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.response-form {
  margin-top: 16px;
}

.response-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 8px;
}

.response-input:focus {
  outline: none;
  border-color: #6b9080;
}

.respond-button {
  padding: 8px 16px;
  background-color: #6b9080;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.respond-button:hover {
  background-color: #5a7b6c;
}

.respond-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  gap: 8px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.pagination-button,
.page-number {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover,
.page-number:hover {
  background-color: #f5f5f5;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  background-color: #6b9080;
  color: white;
  border-color: #6b9080;
}

@media (max-width: 768px) {
  .main {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .branch-selector {
    width: 100%;
  }

  .branch-selector select {
    flex: 1;
  }

  .ratings-summary {
    flex-direction: column;
    gap: 24px;
    padding: 16px;
  }

  .average-rating {
    margin-bottom: 16px;
  }

  .filter-group {
    flex-wrap: wrap;
  }
}
</style>
