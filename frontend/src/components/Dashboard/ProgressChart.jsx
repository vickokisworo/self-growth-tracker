import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProgressChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    rating: Number(item.avg_rating).toFixed(1),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#667eea"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
