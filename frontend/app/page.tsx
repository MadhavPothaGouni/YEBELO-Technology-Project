"use client";

import { useEffect, useState } from "react";
import { fetchRSIData, fetchTradesData } from "../services/api";
import ChartCard from "../components/ChartCard";

interface RSIData {
  token_address: string;
  rsi: number;
  timestamp: string;
}

interface TradeData {
  token_address: string;
  price_in_sol: number;
  timestamp: string;
}

export default function Home() {
  const [rsiData, setRsiData] = useState<RSIData[]>([]);
  const [tradesData, setTradesData] = useState<TradeData[]>([]);

  async function loadData() {
    const [rsi, trades] = await Promise.all([fetchRSIData(), fetchTradesData()]);
    setRsiData(rsi);
    setTradesData(trades);
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        📊 Real-Time RSI Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartCard
          title="RSI Data (last 10)"
          data={rsiData}
          dataKey="rsi"
          color="#2563eb"
        />
        <ChartCard
          title="Trade Prices (in SOL)"
          data={tradesData}
          dataKey="price_in_sol"
          color="#16a34a"
        />
      </div>

      <div className="mt-10 bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Raw Data</h2>
        <details className="cursor-pointer">
          <summary className="text-blue-600 underline">View RSI JSON</summary>
          <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(rsiData, null, 2)}
          </pre>
        </details>

        <details className="cursor-pointer mt-4">
          <summary className="text-blue-600 underline">View Trades JSON</summary>
          <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(tradesData, null, 2)}
          </pre>
        </details>
      </div>
    </main>
  );
}
