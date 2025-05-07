import axios from "axios";

// variable for the storing the current token
let cachedToken = null;
let tokenExpiry = null;

const credentials = {
    email: "tanbirahamedg@gmail.com",
    name: "tanbir ahamed",
    rollNo: "4ni22cs235",
    accessCode: "DRYscE",
    clientID: "406815a5-52ef-45bd-9a60-8295e573e2e8",
    clientSecret: "KNGZCQfCEYPQxUfJ"
};

const getNewToken = async () => {
    try {
        const res = await axios.post(
            'http://20.244.56.144/evaluation-service/auth',
            credentials
        );

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
