import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [rsiData, setRsiData] = useState([]);
  const [tradesData, setTradesData] = useState([]);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const [rsiResponse, tradesResponse] = await Promise.all([
        axios.get("http://localhost:8000/rsi"),
        axios.get("http://localhost:8000/trades")
      ]);
      setRsiData(rsiResponse.data);
      setTradesData(tradesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Auto refresh every 3 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📈 RSI Dashboard</h1>

      <h2>RSI Data</h2>
      <table border="1" cellPadding="8" style={{ marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Token</th>
            <th>RSI</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {rsiData.length > 0 ? (
            rsiData.map((item, index) => (
              <tr key={index}>
                <td>{item.token_address}</td>
                <td>{item.rsi.toFixed(2)}</td>
                <td>{new Date(item.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No RSI data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Trades Data</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Token</th>
            <th>Price (SOL)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {tradesData.length > 0 ? (
            tradesData.map((item, index) => (
              <tr key={index}>
                <td>{item.token_address}</td>
                <td>{item.price_in_sol.toFixed(2)}</td>
                <td>{new Date(item.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No Trade data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
