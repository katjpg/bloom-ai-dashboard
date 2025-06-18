import axios, { AxiosInstance } from 'axios';
import { getApiUrl } from '@/config/api';
import { Message } from '@/types/sentiment';

class ModerationAPIClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: `${getApiUrl()}/api`,
        });

        // Add request interceptor for logging
        this.client.interceptors.request.use(config => {
            console.log('Moderation API Request:', config.method?.toUpperCase(), config.url);
            return config;
        }, error => {
            console.error('Moderation API Request Error:', error);
            return Promise.reject(error);
        });

        // Add response interceptor for logging
        this.client.interceptors.response.use(response => {
            console.log('Moderation API Response:', response.status, response.data);
            return response;
        }, error => {
            console.error('Moderation API Response Error:', error.response?.data || error.message);
            return Promise.reject(error);
        });
    }

    /**
     * Flag a message for moderation review
     * @param messageId The ID of the message to flag
     * @param reason Optional reason for flagging
     * @returns Success response
     */
    async flagMessage(messageId: string, reason?: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await this.client.post('/flag', {
                message_id: messageId,
                reason: reason || "User flagged"
            });
            return response.data;
        } catch (error) {
            console.error('Flag Message Error:', error);
            throw error;
        }
    }

    /**
     * Get all flagged messages for moderation queue
     * @param limit Maximum number of flagged messages to fetch (default: 50)
     * @returns Array of flagged messages
     */
    async getFlaggedMessages(limit: number = 50): Promise<Message[]> {
        try {
            const response = await this.client.get<Message[]>('/flagged', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Get Flagged Messages Error:', error);
            throw error;
        }
    }

    /**
     * Moderate a message only (no sentiment analysis)
     * @param data Message data for moderation
     * @returns Moderation result
     */
    async moderateMessage(data: {
        message: string;
        message_id: string;
        player_id?: number;
        player_name?: string;
    }): Promise<any> {
        try {
            const response = await this.client.post('/moderate', data);
            return response.data;
        } catch (error) {
            console.error('Message Moderation Error:', error);
            throw error;
        }
    }
}

// Create and export a singleton instance
export const moderationApi = new ModerationAPIClient();

// Export the class for custom instantiation if needed
export { ModerationAPIClient };