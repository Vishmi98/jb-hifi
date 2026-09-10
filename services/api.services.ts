import axios, { AxiosResponse } from 'axios';

import { getCookieToken } from '@/utils/cookie.util';
import { ApiCallOptions } from '@/constants/types';


const apiCall = async <T>({
    url,
    method = 'GET',
    body = {},
    params = {},
    isAuth = true,
}: ApiCallOptions): Promise<T> => {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // If authentication is required, retrieve JWT token from local storage
        if (isAuth) {
            const token = getCookieToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                // console.log('No JWT token found in local storage');
            }
        }

        // Configure the Axios request
        const response: AxiosResponse<T> = await axios({
            url,
            method,
            headers,
            data: body,
            params,
        });

        return response.data; // Returns only the data from the response
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

export default apiCall;
