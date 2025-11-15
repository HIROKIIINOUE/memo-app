import { CATEGORY_LIMIT, mockCategories, type MockCategory } from "@/lib/mockCategories";

const CATEGORY_STORAGE_KEY = "memoapp:categories";
const CATEGORY_STORAGE_EVENT = "memoapp:categories-updated";

function safeParseCategories(raw: string | null): MockCategory[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MockCategory[];
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item) =>
        typeof item?.id === "string" &&
        typeof item?.name === "string" &&
        typeof item?.description === "string" &&
        typeof item?.color === "string",
    );
  } catch {
    return null;
  }
}

export function loadStoredCategories(): MockCategory[] {
  if (typeof window === "undefined") {
    return mockCategories;
  }

  const parsed = safeParseCategories(window.localStorage.getItem(CATEGORY_STORAGE_KEY));
  if (parsed && parsed.length > 0) {
    return parsed.slice(0, CATEGORY_LIMIT);
  }
  return mockCategories;
}

export function saveStoredCategories(categories: MockCategory[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  window.dispatchEvent(new Event(CATEGORY_STORAGE_EVENT));
}

export function subscribeCategoryStorage(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(CATEGORY_STORAGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(CATEGORY_STORAGE_EVENT, handler);
  };
}
