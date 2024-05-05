import { CompleteConverse } from "@/types/types";

export function sortConversationByTimestamp(
  conversation: CompleteConverse[]
): CompleteConverse[] {
  return conversation.sort((a, b) => a.timestamp - b.timestamp);
}


export const sanitizeInput = (input: string) => {
  // Remove any HTML tags from the input
  const sanitizedInput = input.replace(/<[^>]*>/g, "");

  // Escape special characters to prevent injection attacks
  const escapedInput = sanitizedInput
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  return escapedInput;
};

