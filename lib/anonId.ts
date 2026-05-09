"use client";

const STORAGE_KEY = "runningmate.anonid.v1";

/**
 * 로그인 없이 한 사람을 식별하기 위한 익명 UUID. 첫 방문 때 생성해서
 * LocalStorage 에 저장. 같은 브라우저면 다음 방문에도 동일 ID 사용.
 *
 * 다른 기기·브라우저는 다른 ID 가 부여되므로 같은 사람이 두 번 카운트
 * 될 수 있다. V1 트래픽 규모에선 그 정도 노이즈는 수용.
 */
export function getOrCreateAnonId(): string {
  if (typeof window === "undefined") return "";
  let id = "";
  try {
    id = localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    // private mode etc.
  }
  if (!id || !UUID_RE.test(id)) {
    id = crypto.randomUUID();
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // storage disabled — accept ephemeral id
    }
  }
  return id;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
