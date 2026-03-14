import { useSearchParams } from "react-router-dom";

export type Role = "admin" | "ops";

export function useRole(): Role {
  const [params] = useSearchParams();
  const role = (params.get("role") || "admin").toLowerCase();
  return role === "ops" ? "ops" : "admin";
}
