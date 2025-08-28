'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { generateCandlestickData } from '@/utils/mockData';
import { useEthMetrics } from '@/hooks/useEthMetrics';
import DashboardCard from '@/components/common/DashboardCard';
import { useTheme } from '@/contexts/ThemeContext';
import { getChartOptions } from '@/utils/chartConfig';

interface CandlestickRaw {
  o?: number;
  h?: number;
  l?: number;
  c?: number;
  y?: number;
}

export default function PriceVolumeChart() {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);
  const isLight = theme === 'light';
  
  // Fetch real ETH data from Firestore
  const { data: ethData, loading, error } = useEthMetrics(30);

  useEffect(() => {
    if (!chartRef.current || loading || !ethData) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Use real data if available, fallback to mock data if not
    const candleData = ethData.length > 0 ? ethData : generateCandlestickData(30);
    const chartColors = getChartOptions(isLight);
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new ChartJS(ctx, {
      type: 'candlestick' as any,
      data: {
        datasets: [
          {
            label: 'ETH Price',
            data: candleData.map(d => ({
              x: d.x,
              o: d.o,
              h: d.h,
              l: d.l,
              c: d.c
            })),
            yAxisID: 'y',
            borderColor: {
              up: '#10B981',
              down: '#EF4444',
              unchanged: '#6B7280'
            },
            backgroundColor: {
              up: 'rgba(16, 185, 129, 0.8)',
              down: 'rgba(239, 68, 68, 0.8)',
              unchanged: 'rgba(107, 114, 128, 0.8)'
            }
          } as any,
          {
            type: 'bar',
            label: 'Volume',
            data: candleData.map(d => ({x: d.x, y: d.v})),
            yAxisID: 'y2',
            backgroundColor: 'rgba(75, 192, 192, 0.15)',
            borderColor: 'transparent',
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index' as const,
          intersect: false
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            },
            grid: {
              display: false
            },
            ticks: {
              color: chartColors.color
            }
          },
          y: {
            position: 'left',
            title: {
              display: true,
              text: 'Price (USD)',
              color: chartColors.color
            },
            ticks: {
              color: chartColors.color
            },
            grid: {
              color: chartColors.gridColor
            }
          },
          y2: {
            position: 'right',
            title: {
              display: true,
              text: 'Volume',
              color: chartColors.color
            },
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              color: chartColors.color,
              callback: function(value: string | number) {
                const num = typeof value === 'number' ? value : parseFloat(value);
                if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
                if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
                return value;
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const raw = context.raw as CandlestickRaw;
                if (context.datasetIndex === 0) {
                  const o = raw.o?.toFixed(2) || '0';
                  const h = raw.h?.toFixed(2) || '0';
                  const l = raw.l?.toFixed(2) || '0';
                  const c = raw.c?.toFixed(2) || '0';
                  return `O: ${o} H: ${h} L: ${l} C: ${c}`;
                }
                return context.dataset.label + ': ' + new Intl.NumberFormat().format(raw.y || 0);
              }
            }
          },
          datalabels: {
            display: false
          }
        } as Record<string, unknown>
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isLight, ethData, loading]);

  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        ETH 价格 & 交易量 (日线)
      </h2>
      <div className="relative" style={{ height: '400px' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500">加载中...</div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-500">加载失败: {error}</div>
          </div>
        )}
        {!loading && !error && ethData && ethData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500">暂无数据，使用模拟数据</div>
          </div>
        )}
        <canvas ref={chartRef} style={{ display: loading ? 'none' : 'block' }}></canvas>
      </div>
    </DashboardCard>
  );
}
