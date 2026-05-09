"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrCreateAnonId } from "./anonId";

const STORAGE_KEY = "runningmate.favorites.v1";

/**
 * LocalStorage 백킹 찜 훅. UI 반응성 위해 LocalStorage 가 truth 이고
 * Supabase 동기화는 background 로 발사 후 실패해도 silent. 다른 기기에서
 * 보면 LocalStorage 가 비어있겠지만 서버 카운트엔 본인 행이 남아있어서
 * 인기순 정렬에 반영됨.
 *
 * 동일 origin 내 여러 탭 간 storage 이벤트 동기화도 처리.
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
      const willAdd = !next.has(id);
      if (willAdd) next.add(id);
      else next.delete(id);
      saveToStorage(next);
      // 서버 동기화 — 실패해도 LocalStorage 는 유지. 인기순엔 반영 안되겠지만
      // UI 는 즉시 반응한다.
      void syncToServer(id, willAdd ? "add" : "remove");
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

async function syncToServer(marathonId: string, action: "add" | "remove") {
  try {
    const userId = getOrCreateAnonId();
    if (!userId) return;
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ marathonId, userId, action }),
      keepalive: true,
    });
  } catch {
    // network/Supabase down — silent.
  }
}
