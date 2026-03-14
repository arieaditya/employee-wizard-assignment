import { STEP2_BASE_URL } from "./api";

export async function fetchLocations(query: string) {
  const res = await fetch(
    `${STEP2_BASE_URL}/locations?name_like=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

export async function fetchDetails(params?: {
  _page?: number;
  _limit?: number;
}) {
  const url = new URL(`${STEP2_BASE_URL}/details`);
  if (params?._page) url.searchParams.set("_page", String(params._page));
  if (params?._limit) url.searchParams.set("_limit", String(params._limit));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch details");
  return res.json();
}

export async function postDetails(data: unknown) {
  await new Promise((r) => setTimeout(r, 3000)); // ≈ 3s delay
  const res = await fetch(`${STEP2_BASE_URL}/details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save details");
  return res.json();
}
