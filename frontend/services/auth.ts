import authAxios from '@/lib/authAxios';


export const login = async (username: string, password: string) => {
    const response = await authAxios.post('/token/', { username, password });
    return response.data;
};

export const refreshToken = async (refreshToken: string) => {
    const response = await authAxios.post('/token/refresh/', { refreshToken });
    return response.data;
};


export const register = async (username: string, password: string, first_name: string, last_name: string) => {
    const response = await authAxios.post('/users/users/', { username, password, first_name, last_name });

    if (response.status === 201) {
        const loginResponse = await login(username, password);
        return loginResponse;
    }

    return response.data;
};