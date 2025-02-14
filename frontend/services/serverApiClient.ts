// /services/serverApiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import * as cookie from 'cookie'; // Correct import for the "cookie" package
import type { NextApiRequest, NextApiResponse } from 'next';

export const createServerApiClient = async (
    req: NextApiRequest,
    res?: NextApiResponse
): Promise<AxiosInstance> => {
    // Parse cookies from the incoming request (including HttpOnly cookies)
    const cookies = cookie.parse(req.headers.cookie || '');
    let accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;

    if (!refreshToken || refreshToken === undefined || refreshToken === null || refreshToken === '') {
        // If no refresh token is available, return a client without any headers
        console.log('No refresh token found');
        return axios.create({ baseURL: process.env.NEXT_PUBLIC_REST_API_URL });
    }


    if (!accessToken || accessToken === undefined) {
        // If no access token is available, return a client without any headers
        console.log('No access token found');
        accessToken = await refreshAccessToken(refreshToken, res);
        console.log('accessToken:', accessToken);
    }

    // Create an axios instance with the external API URL and attach the access token (if available)
    const client = axios.create({
        baseURL: process.env.NEXT_PUBLIC_REST_API_URL, // e.g., "https://api.example.com"
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    // Response interceptor: if a 401 occurs, attempt to refresh the token and retry the request.
    client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                if (refreshToken) {
                    try {
                        // Call your refresh endpoint (adjust endpoint and payload as needed)
                        const newAccessToken = await refreshAccessToken(refreshToken, res);


                        // Update client defaults and the original request headers
                        accessToken = newAccessToken;
                        client.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                        // Retry the original request with the new token
                        return client(originalRequest);
                    } catch (refreshError) {
                        // If refresh fails, clear cookies and reject.
                        if (res) {
                            console.log("erasing it all now");
                            res.setHeader('Set-Cookie', [
                                cookie.serialize('access_token', '', {
                                    path: '/',
                                    httpOnly: true,
                                    secure: process.env.NODE_ENV === 'production',
                                    maxAge: 300,
                                    sameSite: 'strict',
                                }),
                                // cookie.serialize('refresh_token', '', {
                                //     path: '/',
                                //     httpOnly: true,
                                //     secure: process.env.NODE_ENV === 'production',
                                //     maxAge: 86400,
                                //     sameSite: 'strict',
                                // }),
                            ]);
                        }
                        return Promise.reject(refreshError);
                    }
                }
            }
            return Promise.reject(error);
        }
    );

    return client;
};


const refreshAccessToken = async (refreshToken: string, res: any) => {
    const refreshResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_REST_API_URL}/token/refresh/`,
        { refresh: refreshToken }
    );
    const newAccessToken = refreshResponse.data.access;
    // const newRefreshToken = refreshResponse.data.refreshToken;

    // Update cookies on the response (if available) so subsequent requests have the new tokens.
    if (res) {
        res.setHeader('Set-Cookie', [
            cookie.serialize('access_token', newAccessToken, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 86400, // 1 day in seconds
                sameSite: 'strict',
            }),
            // cookie.serialize('refresh_token', newRefreshToken, {
            //     path: '/',
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     maxAge: 604800, // 7 days in seconds
            //     sameSite: 'strict',
            // }),
        ]);
    }
    return newAccessToken;
}