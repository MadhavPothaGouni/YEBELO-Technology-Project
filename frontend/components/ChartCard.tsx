"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Define a generic type for chart data
interface ChartData {
  timestamp: string;
  [key: string]: string | number; // allows flexible fields like rsi or price_in_sol
}

interface ChartCardProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  color: string;
}

export default function ChartCard({ title, data, dataKey, color }: ChartCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" hide />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
