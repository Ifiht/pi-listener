export function extractAssistantReplyText(message: unknown): string {
  const candidate = message as { role?: unknown; content?: unknown } | undefined;
  if (!candidate || candidate.role !== "assistant") return "";

  if (typeof candidate.content === "string") {
    return candidate.content.trim();
  }

  if (Array.isArray(candidate.content)) {
    return candidate.content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string") {
          return (part as { text: string }).text;
        }
        return "";
      })
      .join(" ")
      .trim();
  }

  return "";
}
