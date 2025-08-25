import { ChartData } from 'chart.js';

export type LineChartData = ChartData<'line'>;
export type BarChartData = ChartData<'bar'>;
export type DoughnutChartData = ChartData<'doughnut'>;

export interface ChartComponentState {
  data: LineChartData | BarChartData | DoughnutChartData | null;
}

export interface TooltipContext {
  parsed: {
    x: number;
    y: number;
  };
  raw: {
    o?: number;
    h?: number;
    l?: number;
    c?: number;
    y?: number;
  };
  dataset: {
    label: string;
  };
  datasetIndex: number;
}
