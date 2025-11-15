export type MockCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export const CATEGORY_LIMIT = 6;
export const CATEGORIES_PER_MEMO_LIMIT = 4;

export const mockCategories: MockCategory[] = [
  {
    id: "work",
    name: "仕事",
    description: "タスク管理や商談メモをまとめるカテゴリ",
    color: "#5B6DFF",
  },
  {
    id: "personal",
    name: "個人",
    description: "プライベートな記録や日記",
    color: "#FF8F6B",
  },
  {
    id: "idea",
    name: "アイデア",
    description: "ひらめきや草案をストック",
    color: "#41C9A6",
  },
  {
    id: "research",
    name: "リサーチ",
    description: "学習メモや調査ログ",
    color: "#F2C94C",
  },
];

export function assignMockCategories(memoId: string) {
  if (!memoId || mockCategories.length === 0) return [];
  const hash = memoId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const assignedCount = (hash % CATEGORIES_PER_MEMO_LIMIT) + 1; // 1〜4
  const categories: MockCategory[] = [];
  for (let i = 0; i < assignedCount; i += 1) {
    const index = (hash + i * 7) % mockCategories.length;
    const candidate = mockCategories[index];
    if (!categories.find((category) => category.id === candidate.id)) {
      categories.push(candidate);
    }
  }
  return categories;
}
