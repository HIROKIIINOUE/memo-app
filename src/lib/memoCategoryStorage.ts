const MEMO_CATEGORY_STORAGE_KEY = "memoapp:memo-category-map";
const MEMO_CATEGORY_EVENT = "memoapp:memo-categories-updated";

type MemoCategoryMap = Record<string, string[]>;

function safeParseMap(raw: string | null): MemoCategoryMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as MemoCategoryMap;
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        Array.isArray(value)
          ? value.filter((item): item is string => typeof item === "string")
          : [],
      ]),
    );
  } catch {
    return {};
  }
}

function loadMap(): MemoCategoryMap {
  if (typeof window === "undefined") {
    return {};
  }
  return safeParseMap(window.localStorage.getItem(MEMO_CATEGORY_STORAGE_KEY));
}

function saveMap(map: MemoCategoryMap) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(MEMO_CATEGORY_STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(MEMO_CATEGORY_EVENT));
}

export function loadMemoCategories(memoId: string): string[] {
  const map = loadMap();
  return map[memoId] ?? [];
}

export function saveMemoCategories(memoId: string, categoryIds: string[]) {
  if (!memoId) return;
  const map = loadMap();
  if (categoryIds.length === 0) {
    delete map[memoId];
  } else {
    map[memoId] = [...new Set(categoryIds)];
  }
  saveMap(map);
}

export function loadAllMemoCategories(): MemoCategoryMap {
  return loadMap();
}

export function subscribeMemoCategories(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(MEMO_CATEGORY_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(MEMO_CATEGORY_EVENT, handler);
  };
}
