import { STEP1_BASE_URL } from "./api";

export async function fetchDepartments(query: string) {
  const res = await fetch(
    `${STEP1_BASE_URL}/departments?name_like=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Failed to fetch departments");
  return res.json();
}

export async function fetchBasicInfo(params?: {
  _page?: number;
  _limit?: number;
}) {
  const url = new URL(`${STEP1_BASE_URL}/basicInfo`);
  if (params?._page) url.searchParams.set("_page", String(params._page));
  if (params?._limit) url.searchParams.set("_limit", String(params._limit));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch basic info");
  return res.json();
}

export async function postBasicInfo(data: unknown) {
  await new Promise((r) => setTimeout(r, 3000)); // ≈ 3s delay
  const res = await fetch(`${STEP1_BASE_URL}/basicInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save basic info");
  return res.json();
}
