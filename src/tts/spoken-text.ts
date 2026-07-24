export function normalizeSpokenText(text: string): string {
  const plain = String(text ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\((?:[^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1")
    .replace(/^(?:#{1,6}\s+|>\s+|[-*+]\s+|\d+\.\s+)/gm, "")
    .replace(/^[-*_]{3,}\s*$/gm, " ")
    .replace(/[\*_~]/g, "")
    .replace(/\r?\n+/g, " ");

  return plain.replace(/\s+/g, " ").trim();
}
