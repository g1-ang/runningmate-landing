"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "runningmate.favorites.v1";

/**
 * LocalStorage 백킹 찜 훅. 동일 origin 내 여러 탭 간 storage 이벤트
 * 동기화도 처리. 서버 사이드에선 빈 Set 반환 (hydration 안전).
 */
export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(loadFromStorage());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setIds(loadFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isFavorite = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveToStorage(next);
      return next;
    });
  }, []);

  return { ids, isFavorite, toggle, hydrated };
}

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? "";
    return new Set(raw.split(",").filter(Boolean));
  } catch {
    return new Set();
  }
}

function saveToStorage(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, Array.from(ids).join(","));
  } catch {
    // private mode / disabled storage — no-op
  }
}
