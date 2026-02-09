"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface OverviewProps {
  data: {
    name: string;
    created: number;
    updated: number;
  }[];
}

export function Overview({ data }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{ borderRadius: "8px" }}
          
        />
        <Legend />
        <Bar
          dataKey="created"
          fill="#373f44"
          radius={[4, 4, 0, 0]}
          className="fill-[#373f44]"
          name="Created"
        />
        <Bar
          dataKey="updated"
          fill="#f5b700"
          radius={[4, 4, 0, 0]}
          className="fill-[var(--accent)]"
          name="Updated"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}