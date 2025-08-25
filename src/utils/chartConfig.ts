import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
  TimeSeriesScale,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement
} from 'chartjs-chart-financial';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
  TimeSeriesScale,
  Filler,
  ChartDataLabels,
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement
);

// Default chart options based on theme
export const getChartOptions = (isLight: boolean) => ({
  color: isLight ? '#6B7280' : '#9CA3AF',
  borderColor: isLight ? '#E5E7EB' : '#374151',
  gridColor: isLight ? '#E5E7EB' : '#374151'
});

// Common chart configurations
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: {
          family: "'Noto Sans SC', sans-serif"
        }
      }
    },
    tooltip: {
      bodyFont: {
        family: "'Noto Sans SC', sans-serif"
      },
      titleFont: {
        family: "'Noto Sans SC', sans-serif"
      }
    }
  }
};
