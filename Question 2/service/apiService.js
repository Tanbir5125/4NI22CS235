import axios from 'axios';
import { getAuthToken } from '../manage/authManager.js';
import { BASE_API_URL } from '../config/apiConfig.js';

// Utility function to log errors only in development environment
const logError = (message, error) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(message, error);
    }
};

export const fetchUsers = async () => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${BASE_API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data || [];
    } catch (error) {
        logError('Error fetching users:', error.message);
        throw new Error('Failed to fetch users');
    }
};

export const fetchUserPosts = async (userId) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${BASE_API_URL}/users/${userId}/posts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.posts || [];
    } catch (error) {
        // Don't log every 503 error
        throw new Error(`Failed to fetch posts for user ${userId}`);
    }
};

export const fetchPostComments = async (postId) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${BASE_API_URL}/posts/${postId}/comments`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.comments || [];
    } catch (error) {
        // Don't log every 503 error
        throw new Error(`Failed to fetch comments for post ${postId}`);
    }
};