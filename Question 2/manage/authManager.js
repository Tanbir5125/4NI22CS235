import axios from "axios";

import credentials from "../Credentials/credentials.js";

let cachedToken = null;
let tokenExpiry = null;

const getNewToken = async () => {
    try {
        const res = await axios.post(
            'http://20.244.56.144/evaluation-service/auth',
            credentials
        )

        const data = res.data;
        cachedToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000 - 30000;
        console.log("Token refreshed successfully");
        return cachedToken;
    } catch (error) {
        throw new Error('Failed to refresh token');
    }
}

export const getAuthToken = async () => {
    if (!cachedToken || Date.now() > tokenExpiry) {
        return await getNewToken();
    }
    return cachedToken;
}