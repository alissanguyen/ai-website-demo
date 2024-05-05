
/**
 * If conversation growing very large and want to optimize performance, we can 
 * implementing lazy loading or pagination to load only a subset of the 
 * conversation at a time.
 * Additionally, if we need to persist the conversation data across sessions 
 * or enable features like search or filtering, you can consider storing the 
 * conversation data in a database or a server-side storage solution.
 */
export interface CompleteConverse {
    prompt: string;
    response: {
        type: 'image' | 'text' | 'imageClassification';
        content: string;
        imageUrl?: string;
    };
    timestamp: number;
}

export interface Model {
    id: string;
    name: string
}

export interface UserProfile {
    avatar_url: string | null;
    conversations: CompleteConverse[] | null;
    full_name: string | null;
    id: string;
    updated_at: string;
    username: string | null;
    website: string | null;
}