import { getAuthToken } from "./authManager.js";
import axios from "axios";

export const fetchNumbers = async (numberId) => {
    // Map the route parameters to the third-party API's parameters
    const typeMap = {
        'p': 'primes',
        'f': 'fibo',
        'e': 'even',
        'r': 'rand'
    };

    const apiNumberType = typeMap[numberId];
    const url = `http://20.244.56.144/evaluation-service/${apiNumberType}`;
    const token = await getAuthToken();

    try {
        const res = await axios.get(url, {
            timeout: 500,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.numbers || [];
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        return [];
    }
}