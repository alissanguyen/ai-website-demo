import { CompleteConverse } from "@/types";

export function sortConversationByTimestamp(conversation: CompleteConverse[]): CompleteConverse[] {
    return conversation.sort((a, b) => a.timestamp - b.timestamp);
}

export function getConversationFromLocalStorage(): CompleteConverse[] {
    const conversationString = localStorage.getItem('conversation');
    return conversationString ? JSON.parse(conversationString) : [];
}