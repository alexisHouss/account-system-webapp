import axiosInstance from '@/lib/authAxios';


export const search_user = async (username: string) => {
    const response = await axiosInstance.get('/users/profiles/search/?username=' + username);
    return response.data;
};
