import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ title, data, labels, colors }: any) {
  const _data = {
    labels: labels,

    datasets: [
      {
        label: title,
        data: data,
        borderWidth: 1,
        backgroundColor: colors,
        borderColor: [],
      },
    ],
  };
  return <Pie style={{ maxHeight: "400px" }} data={_data} />;
}
