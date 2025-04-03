<template>
  <div class="main">
    <h1>Dashboard</h1>
    <div class="data-grid">
      <DataWidget />
      <DataWidget />
      <DataWidget />
    </div>
    <div class="graph-grid">
      <div class="bargraph">
        <h3>Membership stat</h3>
        <Chart
          type="bar"
          :data="chartData"
          :options="chartOptions"
          class="h-[30rem]"
          style="width: 55rem; height: 30rem"
        />
      </div>
      <div class="chart">
        <h3>Most used restaurant</h3>
        <Chart
          type="doughnut"
          :data="chartDonut"
          :options="chartDOptions"
          style="height: 30rem; width: 30rem"
        />
      </div>
    </div>
    <div class="table">
      <DataTable :value="products" ref="dt" tableStyle="min-width: 50rem">
        <template #header>
          <div class="export-buttons">
            <h3>Restaurant</h3>
            <Button label="Export" @click="exportCSV">
                Export
              <Icon icon="lsicon:file-export-filled" />
            </Button>
          </div>
        </template>
        <Column
          field="restaurant"
          header="Restaurant Name"
          exportHeader="Restaurant name"
        ></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div>
  </div>
</template>
<style lang="css">
.main {
  padding: 20px;
}
h1,
h3 {
  font-weight: 500;
}
.data-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}
.bargraph {
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: auto;
  background-color: white;
  padding: 1.25rem;
  border-radius: 20px;
}
.chart {
  justify-content: center;
  background-color: white;
  padding: 1.25rem;
  border-radius: 20px;
  grid-column: span 1; /* Takes one column */
}
.graph-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
}
.export-buttons {
  display: flex;
  justify-content: space-between;
}
.table {
  margin-top: 2rem;
  background-color: white;
  padding: 1.25rem;
  border-radius: 20px;
}
</style>
<script setup lang="ts">
import DataWidget from '@/components/DataWidget.vue';

import Button from 'primevue/button';
import { Icon } from '@iconify/vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import Chart from 'primevue/chart';
import { ref, onMounted } from 'vue';

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
  chartDonut.value = setChartDonut();
  chartDOptions.value = setChartDOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'VVIP',
        backgroundColor: documentStyle.getPropertyValue('--p-red-500'),
        borderColor: documentStyle.getPropertyValue('--p-red-500'),
        data: [12, 4, 25, 8, 11, 45, 23],
      },
      {
        label: 'VIP',
        backgroundColor: documentStyle.getPropertyValue('--p-blue-500'),
        borderColor: documentStyle.getPropertyValue('--p-blue-500'),
        data: [28, 48, 40, 19, 42, 27, 22],
      },
      {
        label: 'Normal',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: [78, 56, 90, 81, 86, 71, 69],
      },
    ],
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue(
    '--p-text-muted-color'
  );
  const surfaceBorder = documentStyle.getPropertyValue(
    '--p-content-border-color'
  );

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
};

const chartDonut = ref();
const chartDOptions = ref(null);

const setChartDonut = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ['MK', 'Sushiro', 'Teenoi'],
    datasets: [
      {
        data: [540, 325, 702],
        backgroundColor: [
          documentStyle.getPropertyValue('--p-orange-300'),
          documentStyle.getPropertyValue('--p-emerald-500'),
          documentStyle.getPropertyValue('--p-green-950'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-orange-100'),
          documentStyle.getPropertyValue('--p-emerald-300'),
          documentStyle.getPropertyValue('--p-green-600'),
        ],
      },
    ],
  };
};

const setChartDOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: textColor,
        },
      },
    },
  };
};
const dt = ref();
const products = ref([]);

onMounted(() => {
  // Mock data
  products.value = [
    {
      restaurant: 'MK restaurant',
      name: 'Burger',
      category: 'Fast Food',
      quantity: 20,
    },
    { restaurant: 'Sushiro', name: 'Pizza', category: 'Italian', quantity: 15 },
    { restaurant: 'Yayoi', name: 'Sushi', category: 'Japanese', quantity: 10 },
    {
      restaurant: 'Pepper steak',
      name: 'Tacos',
      category: 'Mexican',
      quantity: 25,
    },
    { restaurant: 'Teenoi', name: 'Pasta', category: 'Italian', quantity: 18 },
    {
      restaurant: 'Hot Pot man',
      name: 'Fried Chicken',
      category: 'Fast Food',
      quantity: 22,
    },
    { restaurant: 'Fuji', name: 'Salad', category: 'Healthy', quantity: 30 },
  ];
});

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
