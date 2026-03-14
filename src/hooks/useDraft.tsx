import { useEffect } from "react";
import type { Role as UserRole } from "./useRole";
import { DRAFT_ADMIN_KEY, DRAFT_OPS_KEY } from "../constants/storageKeys";

type DraftData = unknown;

function getKeyForRole(role: UserRole) {
  return role === "admin" ? DRAFT_ADMIN_KEY : DRAFT_OPS_KEY;
}

export function loadDraft(role: UserRole): DraftData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getKeyForRole(role));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useDraftAutosave(role: UserRole, data: DraftData) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = getKeyForRole(role);
    const id = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save draft", e);
      }
    }, 2000); // 2 seconds

    return () => clearTimeout(id);
  }, [role, data]);
}

export function clearDraft(role: UserRole) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getKeyForRole(role));
  } catch (e) {
    console.error(e);
  }
}
