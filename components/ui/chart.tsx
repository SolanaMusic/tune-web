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
  type ChartOptions,
  type Scale,
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

interface ChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function LineChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  className,
}: ChartProps) {
  const chartData = {
    labels: data.map((item) => item[index]),
    datasets: categories.map((category, i) => ({
      label: category,
      data: data.map((item) => item[category]),
      borderColor: colors[i % colors.length],
      backgroundColor: colors[i % colors.length],
      tension: 0.4,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", display: false },
      title: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: function (
            this: Scale,
            tickValue: string | number,
            _index?: number,
            _ticks?: unknown
          ) {
            const numeric =
              typeof tickValue === "string" ? Number(tickValue) : tickValue;
            return valueFormatter
              ? valueFormatter(Number(numeric))
              : String(tickValue);
          },
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
    labels: data.map((item) => item[index]),
    datasets: categories.map((category, i) => ({
      label: category,
      data: data.map((item) => item[category]),
      backgroundColor: colors[i % colors.length],
    })),
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", display: false },
      title: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: function (
            this: Scale,
            tickValue: string | number,
            _index?: number,
            _ticks?: unknown
          ) {
            const numeric =
              typeof tickValue === "string" ? Number(tickValue) : tickValue;
            return valueFormatter
              ? valueFormatter(Number(numeric))
              : String(tickValue);
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} className={className} />;
}

export function PieChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  className,
}: ChartProps) {
  const chartData = {
    labels: data.map((item) => item[index]),
    datasets: categories.map((category, i) => ({
      label: category,
      data: data.map((item) => item[category]),
      backgroundColor: colors,
      borderWidth: 0,
    })),
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label ?? "";
            const value = context.raw;
            if (valueFormatter)
              return `${label}: ${valueFormatter(Number(value))}`;
            return `${label}: ${value}`;
          },
        },
      },
      title: { display: false },
    },
  };

  return <Pie data={chartData} options={options} className={className} />;
}
