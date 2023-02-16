import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ title, data, labels }: any) {
  const _data = {
    labels: labels,

    datasets: [
      {
        label: title,
        data: data,
        borderWidth: 1,
        backgroundColor: "#8BB7A277",
        borderColor: "#8BB7A2",
      },
    ],
  };
  return <Radar style={{ maxHeight: "400px" }} data={_data} />;
}
