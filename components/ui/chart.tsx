"use client";

import type React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  name: string;
  total: number;
}

interface PieChartData {
  name: string;
  value: number;
}

interface ChartProps {
  data: ChartData[] | PieChartData[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
  label?: ({ dataEntry }: { dataEntry: any }) => string;
  labelStyle?: React.CSSProperties;
}

export function LineChart({
  data,
  categories,
  colors,
  valueFormatter,
  className,
}: ChartProps) {
  const chartData = {
    labels: data.map((item: any) => item.name),
    datasets: categories.map((category, index) => ({
      label: category,
      data: data.map((item: any) => item[category]),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.4,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: valueFormatter,
        },
      },
    },
  };

  return <Line data={chartData} options={options} className={className} />;
}

export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  className,
}: ChartProps) {
  const chartData = {
    labels: data.map((item: any) => item[index]),
    datasets: categories.map((category, i) => ({
      label: category,
      data: data.map((item: any) => item[category]),
      backgroundColor: colors[i % colors.length],
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: valueFormatter,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} className={className} />;
}

export function PieChart({
  data,
  category,
  index,
  colors,
  valueFormatter,
  className,
  label,
  labelStyle,
}: ChartProps) {
  const chartData = {
    labels: data.map((item: any) => item[index]),
    datasets: [
      {
        label: category,
        data: data.map((item: any) => item[category]),
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw;
            return `${label}: ${value}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  return <Pie data={chartData} options={options} className={className} />;
}
