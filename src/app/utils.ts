import { CompleteConverse } from "@/types";

export function sortConversationByTimestamp(conversation: CompleteConverse[]): CompleteConverse[] {
    return conversation.sort((a, b) => a.timestamp - b.timestamp);
}