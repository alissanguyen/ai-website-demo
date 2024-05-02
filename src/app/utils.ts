import { CompleteConverse } from "@/types";

export function sortConversationByTimestamp(conversation: CompleteConverse[]): CompleteConverse[] {
    return conversation.sort((a, b) => a.timestamp - b.timestamp);
}

export function getConversationFromLocalStorage(): CompleteConverse[] {
  /**
   * 1. We first check if the window object is defined using 
   * typeof window !== 'undefined'. This is necessary because localStorage is 
   * a browser-specific feature and may not be available in all environments 
   * (e.g., server-side rendering).
   * 
   * 2. We also check if window.localStorage exists using window.localStorage. 
   * This ensures that the localStorage object is available before accessing it.
   * 
   * 3. If either the window object is not defined or window.localStorage is 
   * not available, we return an empty array [] as a fallback.
   */
  if (typeof window !== 'undefined' && window.localStorage) {
    const conversationString = localStorage.getItem('conversation');

    /**
     * If the 'conversation' item exists in localStorage, we parse it using 
     * JSON.parse(conversationString) and return the parsed array.
     */
    return conversationString ? JSON.parse(conversationString) : [];
  }
  return [];
}

export const sanitizeInput = (input: string) => {
    // Remove any HTML tags from the input
    const sanitizedInput = input.replace(/<[^>]*>/g, '');
  
    // Escape special characters to prevent injection attacks
    const escapedInput = sanitizedInput
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  
    return escapedInput;
  };