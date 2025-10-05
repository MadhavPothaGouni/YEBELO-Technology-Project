export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchRSIData() {
  const res = await fetch(`${API_URL}/rsi`);
  return res.json();
}

export async function fetchTradesData() {
  const res = await fetch(`${API_URL}/trades`);
  return res.json();
}
