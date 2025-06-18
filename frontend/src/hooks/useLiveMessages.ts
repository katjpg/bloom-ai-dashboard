import { useState, useCallback, useRef, useEffect } from 'react';
import { sentimentApi } from '@/lib/api/sentiment';
import { Message } from '@/types/sentiment';

interface UseLiveMessagesOptions {
    onNewMessage?: (message: Message) => void;
}

export function useLiveMessages(options?: UseLiveMessagesOptions) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const lastFetchTimeRef = useRef<number>(0);
    const isFetchingRef = useRef<boolean>(false);
    const latestMessageIdRef = useRef<string | number | null>(null);
    
    // Memoized messages array reference to avoid dependency issues
    const messagesRef = useRef<Message[]>([]);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);
    
    const fetchMessages = useCallback(async (showLoading = true) => {
        // Skip if a fetch is already in progress
        if (isFetchingRef.current) {
            console.log("Fetch skipped: already fetching");
            return;
        }
        
        isFetchingRef.current = true;
        
        try {
            if (showLoading) {
                setLoading(true);
            }
            console.log("Fetching live messages");
            const data = await sentimentApi.getLiveMessages(20);
            console.log("Fetch successful, messages:", data.length);
            
            // Check for new messages and trigger auto-moderation
            if (data.length > 0) {
                const previousMessageIds = new Set(messagesRef.current.map(msg => msg.message_id));
                const newMessages = data.filter(msg => !previousMessageIds.has(msg.message_id));
                
                console.log(`Found ${newMessages.length} new messages out of ${data.length} total`);
                
                // Process new messages for auto-moderation
                newMessages.forEach(msg => {
                    console.log(`Processing new message: ${msg.message_id}`);
                    options?.onNewMessage?.(msg);
                });
            }
            
            setMessages(data);

            if (data.length > 0) {
                latestMessageIdRef.current = data[0].message_id;
            }
            
            setError(null);
        } catch (err) {
            console.error("Fetch error:", err);
            setError('Failed to load messages');
        } finally {
            setLoading(false);
            lastFetchTimeRef.current = Date.now();
            isFetchingRef.current = false;
        }
    }, []);

    // Function to refresh after new message analysis
    const refreshAfterAnalysis = useCallback(async () => {
        console.log("Refreshing after message analysis");
        await fetchMessages(false); // Don't show loading spinner for background refresh
    }, [fetchMessages]);

    return {
        messages,
        error,
        loading,
        fetchMessages,
        refreshAfterAnalysis
    };
}