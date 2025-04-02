<template>
  <div class="main">
    <h1>Dashboard</h1>
    <div class="data-grid">
      <DataWidget />
      <DataWidget />
      <DataWidget />
    </div>
    <div class="graph-grid">
      <div class="chart">
        <h3>Draft Name</h3>
        <Chart
          type="doughnut"
          :data="chartDonut"
          :options="chartDOptions"
          class="w-full md:w-[30rem]chartDonut"
        />
      </div>
      <div class="rightbox">
        <div class="linegraph">
            <h3>Line Graph</h3>
          <Chart
            type="line"
            :data="chartData"
            :options="chartOptions"
            class="h-[30rem]"
          />
        </div>
        <div class="table">
          <h3>Manager Name</h3>
          <DataTable
            v-model:editingRows="editingRows"
            :value="products"
            editMode="row"
            dataKey="id"
            @row-edit-save="onRowEditSave"
            :pt="{
              table: { style: 'min-width: 50rem' },
              column: {
                bodycell: ({ state }) => ({
                  style:
                    state['d_editing'] &&
                    'padding-top: 0.75rem; padding-bottom: 0.75rem',
                }),
              },
            }"
          >
            <Column field="name" header="Name" style="width: 20%">
              <template #editor="{ data, field }">
                <InputText v-model="data[field]" fluid />
              </template>
            </Column>
            <Column field="branch" header="Branch" style="width: 20%">
              <template #editor="{ data, field }">
                <InputText v-model="data[field]" fluid />
              </template>
            </Column>
            <Column
              :rowEditor="true"
              style="width: 10%; min-width: 8rem"
              bodyStyle="text-align:center"
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import DataWidget from '@/components/DataWidget.vue';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { ref, onMounted } from 'vue';

onMounted(() => {
  chartDonut.value = setChartDonut();
  chartDOptions.value = setChartDOptions();
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartDonut = ref();
const chartDOptions = ref(null);

const setChartDonut = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ['A', 'B', 'C'],
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

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-green-500'),
        tension: 0.4,
      },
      {
        label: 'Second Dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-salte-500'),
        tension: 0.4,
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
    aspectRatio: 0.6,
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
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};

const editingRows = ref([]);
// Mock data
const products = ref([
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Selena',
        branch: 'Central World'
    },
    {
        id: '1001',
        code: 'nvklal433',
        name: 'Kevin',
        branch: 'Robinson Ladkrabang',
        rating: 4
    },
    {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Blue Band',
        branch: 'Central World',
        rating: 3
    }
]);
const onRowEditSave = (event) => {
    let { newData, index } = event;
    products.value[index] = newData;
};


</script>
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
.linegraph {
  justify-content: center;
  background-color: white;
  padding: 1.25rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
}
.rightbox {
  grid-column: span 2;
}
.table {
    background-color: white;
    padding: 1.25rem;
    border-radius: 20px;
    margin-bottom: 1.5rem;
}
</style>
