import { fetchUsers, fetchUserPosts, fetchPostComments } from './apiService.js';
import { getCachedData, setCachedData } from './cacheService.js';
import { TOP_USERS_COUNT, LATEST_POSTS_COUNT } from '../config/apiConfig.js';

const logError = (message, error) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(message, error);
    }
};

// Get top users with most commented posts
export const getTopUsers = async () => {
    const cacheKey = 'top-users';
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        // Fetch all users
        const usersData = await fetchUsers();

        // Check if usersData has the expected structure
        if (!usersData || !usersData.users) {
            logError('Unexpected response format:', usersData);
            return [];
        }

        // Convert users object to array with id and name
        const users = Object.entries(usersData.users).map(([id, name]) => ({
            id,
            name
        }));

        // For each user, fetch their posts and count comments with error handling
        const usersWithCommentCounts = await Promise.all(
            users.map(async (user) => {
                try {
                    const posts = await fetchUserPosts(user.id);

                    // For each post, fetch comments and count them with error handling
                    const postsWithCommentCounts = await Promise.all(
                        posts.map(async (post) => {
                            try {
                                const comments = await fetchPostComments(post.id);
                                return {
                                    ...post,
                                    commentCount: comments.length
                                };
                            } catch (error) {
                                return {
                                    ...post,
                                    commentCount: 0
                                };
                            }
                        })
                    );

                    // Calculate total comments across all posts
                    const totalComments = postsWithCommentCounts.reduce(
                        (sum, post) => sum + post.commentCount, 0
                    );

                    return {
                        ...user,
                        totalComments,
                        posts: postsWithCommentCounts
                    };
                } catch (error) {
                    // Don't log every post fetch error
                    return {
                        ...user,
                        totalComments: 0,
                        posts: []
                    };
                }
            })
        );

        // Sort users by total comment count and take top N
        const topUsers = usersWithCommentCounts
            .sort((a, b) => b.totalComments - a.totalComments)
            .slice(0, TOP_USERS_COUNT);

        setCachedData(cacheKey, topUsers);
        return topUsers;
    } catch (error) {
        logError('Error in getTopUsers:', error.message);
        return []; // Return empty array instead of throwing to prevent app crash
    }
};

export const getPosts = async (type = 'popular') => {
    const cacheKey = `posts-${type}`;
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        // Fetch all users
        const usersData = await fetchUsers();

        // Check if usersData has the expected structure
        if (!usersData || !usersData.users) {
            logError('Unexpected response format:', usersData);
            return [];
        }

        // Convert users object to array with id and name
        const users = Object.entries(usersData.users).map(([id, name]) => ({
            id,
            name
        }));

        // Fetch all posts from all users with error handling
        const allPosts = [];
        for (const user of users) {
            try {
                const userPosts = await fetchUserPosts(user.id);

                // Add user info to each post
                const postsWithUserInfo = userPosts.map(post => ({
                    ...post,
                    user: {
                        id: user.id,
                        name: user.name
                    }
                }));

                allPosts.push(...postsWithUserInfo);
            } catch (error) {
            }
        }

        // For each post, fetch and count comments with error handling
        const postsWithComments = await Promise.all(
            allPosts.map(async (post) => {
                try {
                    const comments = await fetchPostComments(post.id);
                    return {
                        ...post,
                        commentCount: comments.length,
                        comments
                    };
                } catch (error) {
                    // Don't log every comment fetch error
                    return {
                        ...post,
                        commentCount: 0,
                        comments: []
                    };
                }
            })
        );

        let result = [];

        if (postsWithComments.length > 0) {
            if (type === 'popular') {
                // Sort by comment count (descending)
                result = postsWithComments.sort((a, b) => b.commentCount - a.commentCount);

                // If multiple posts have the same max comment count, include all of them
                if (result.length > 0) {
                    const maxComments = result[0].commentCount;
                    result = result.filter(post => post.commentCount === maxComments);
                }
            } else if (type === 'latest') {
                result = postsWithComments
                    .sort((a, b) => b.id - a.id)
                    .slice(0, LATEST_POSTS_COUNT);
            }
        }

        setCachedData(cacheKey, result);
        return result;
    } catch (error) {
        logError(`Error in getPosts (${type}):`, error.message);
        return []; // Return empty array instead of throwing to prevent app crash
    }
};