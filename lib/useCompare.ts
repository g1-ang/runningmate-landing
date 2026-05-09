"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "runningmate.compare.v1";
const MAX = 3;

/**
 * 비교 큐 (LocalStorage). 최대 3개까지. 동일 origin 다중 탭은 storage
 * 이벤트로 동기화.
 */
export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(load());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIds(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  /**
   * 추가/제거 토글. 가득 차 있으면 false 반환 (호출측이 안내).
   */
  const toggle = useCallback((id: string): boolean => {
    let added: boolean | null = null;
    setIds((prev) => {
      if (prev.includes(id)) {
        added = false;
        const next = prev.filter((x) => x !== id);
        save(next);
        return next;
      }
      if (prev.length >= MAX) {
        added = null; // 가득 — 추가 안 함
        return prev;
      }
      added = true;
      const next = [...prev, id];
      save(next);
      return next;
    });
    return added !== null;
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    save([]);
  }, []);

  const remove = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      save(next);
      return next;
    });
  }, []);

  return { ids, has, toggle, clear, remove, hydrated, max: MAX };
}

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? "";
    return raw.split(",").filter(Boolean).slice(0, MAX);
  } catch {
    return [];
  }
}

function save(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, ids.slice(0, MAX).join(","));
  } catch {
    // private mode — no-op
  }
}
