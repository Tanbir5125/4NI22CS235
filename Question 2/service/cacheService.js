import { TIME_TO_LIVE } from '../config/apiConfig.js';

// In-memory cache
let cache = {};
let cacheTimers = {};

export const setupCache = () => {
    // Clear cache periodically to prevent memory leaks
    setInterval(() => {
        const now = Date.now();
        Object.keys(cacheTimers).forEach(key => {
            if (now > cacheTimers[key]) {
                delete cache[key];
                delete cacheTimers[key];
            }
        });
    }, 60000);
};

export const getCachedData = (key) => {
    return cache[key];
};

export const setCachedData = (key, data) => {
    cache[key] = data;
    cacheTimers[key] = Date.now() + TIME_TO_LIVE;
};

export const clearCache = () => {
    cache = {};
    cacheTimers = {};
};