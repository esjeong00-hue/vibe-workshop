"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import type { CategoryCount } from "@/lib/signups";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// 오렌지 계열 중심 팔레트
const ORANGE_PALETTE = [
  "#ff6b35",
  "#ff8c5a",
  "#ffac80",
  "#e85d2a",
  "#ffcaa6",
  "#c94f24",
  "#ff7847",
  "#ffd9c2",
];

const LIGHT = "#cbd5e1";
const GRID = "rgba(255,255,255,0.08)";

// 도넛/파이 공통 옵션 (다크 테마, 범례 밝은색)
const pieOptions: ChartOptions<"doughnut" | "pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: LIGHT, boxWidth: 12, padding: 12, font: { size: 11 } },
    },
  },
};

export function DepartmentDoughnut({ count }: { count: CategoryCount }) {
  return (
    <Doughnut
      data={{
        labels: count.labels,
        datasets: [
          {
            data: count.data,
            backgroundColor: count.labels.map(
              (_, i) => ORANGE_PALETTE[i % ORANGE_PALETTE.length]
            ),
            borderColor: "#1a1a2e",
            borderWidth: 2,
          },
        ],
      }}
      options={pieOptions as ChartOptions<"doughnut">}
    />
  );
}

export function LearningGoalPie({ count }: { count: CategoryCount }) {
  return (
    <Pie
      data={{
        labels: count.labels,
        datasets: [
          {
            data: count.data,
            backgroundColor: count.labels.map(
              (_, i) => ORANGE_PALETTE[i % ORANGE_PALETTE.length]
            ),
            borderColor: "#1a1a2e",
            borderWidth: 2,
          },
        ],
      }}
      options={pieOptions as ChartOptions<"pie">}
    />
  );
}

export function AiExperienceBar({ count }: { count: CategoryCount }) {
  const options: ChartOptions<"bar"> = {
    indexAxis: "y", // 수평 바
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: LIGHT, precision: 0 },
        grid: { color: GRID },
      },
      y: {
        ticks: { color: LIGHT, font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  return (
    <Bar
      data={{
        labels: count.labels,
        datasets: [
          {
            data: count.data,
            backgroundColor: "#ff6b35",
            hoverBackgroundColor: "#ff8c5a",
            borderRadius: 6,
            barThickness: 22,
          },
        ],
      }}
      options={options}
    />
  );
}

export function DailyTrendLine({ count }: { count: CategoryCount }) {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: LIGHT }, grid: { color: GRID } },
      y: {
        beginAtZero: true,
        ticks: { color: LIGHT, precision: 0 },
        grid: { color: GRID },
      },
    },
  };

  return (
    <Line
      data={{
        labels: count.labels,
        datasets: [
          {
            data: count.data,
            borderColor: "#ff6b35",
            backgroundColor: "rgba(255,107,53,0.15)",
            pointBackgroundColor: "#ff6b35",
            fill: true,
            tension: 0.3,
          },
        ],
      }}
      options={options}
    />
  );
}
