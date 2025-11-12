/* eslint-disable react-hooks/set-state-in-effect */
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppSelector } from "../../hooks/appHooks";
import { marketApi } from "../../http/marketApi";
import type { HistoricalResponse } from "../../types";

export default function PriceChart() {
  const { selected, prices } = useAppSelector((s) => s.market);
  const [chartData, setChartData] = useState<{ ts: string; price: number }[]>(
    []
  );

  const { data, isLoading } = useQuery({
    queryKey: ["historical", selected],
    queryFn: () => marketApi.getHistorical(selected!, 40),
    enabled: !!selected,
    select: (response: HistoricalResponse) =>
      response.data.map((d, index) => ({
        ts: new Date(d.ts).toLocaleTimeString(),
        price: d.close + Math.sin(index / 2) * 2.4, // i made this for bar Curve as the flucation we do in backend is quite small so i wanted the bar to show like an obvios flucation curve
      })),
  });

  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [data]);

  // Thsi can also be derived state based on new react compiler 19 which suggest to move sync calls outside useEffect and we can also prepare this in backend as part of this response
  useEffect(() => {
    if (selected && prices[selected]) {
      setChartData((prev) => [
        ...prev.slice(-39),
        {
          ts: new Date().toLocaleTimeString(),
          price: prices[selected].price,
        },
      ]);
    }
  }, [prices, selected]);

  if (!selected)
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Select or click a ticker on the sidebar to view its chart
      </div>
    );

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Loading chart view of the ticker...
      </div>
    );

  return (
    <div className="w-full h-[580px] bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        {selected} — Real-Time Price
      </h2>
      <div className="h-[500px]">
        {/**I have used this because this package of the chart expect the parent to have a explicit height set to it so to infer px height i use is usefull tiny library*/}
        <AutoSizer>
          {({ height, width }) => (
            <ResponsiveContainer width={width} height={height}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="ts" tick={{ fill: "#6B7280", fontSize: 11 }} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    color: "#111827",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
