import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

export default function VerticalChart({ title, data, labels }: any) {
  const _data = {
    labels: labels,

    datasets: [
      {
        label: title,
        data: data,
        borderWidth: 1,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };
  return <Bar style={{ maxHeight: "400px" }} options={options} data={_data} />;
}
