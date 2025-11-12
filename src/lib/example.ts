export function formatMemoCount(count: number): string {
  if (count <= 0) return "No memos yet";
  if (count === 1) return "1 memo";
  return `${count} memos`;
}
