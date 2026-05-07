import { getLoginStorage, removeLoginStorage } from '@/helpers/set-storage';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_URL_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { token } = getLoginStorage();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    async (error) => {
        const { response } = error;
        const responseUrl = response?.request?.responseURL || "";
        const isLogin = responseUrl.split("/").pop() === "login";

        if (response?.status === 401 && !isLogin) {
            removeLoginStorage();
            window.location.href = "/login";
        }
        return Promise.reject(response?.data || error);
    }
);

/**
 * Service Wrapper
 * T = Type ของข้อมูลที่จะได้รับกลับมา (Response Data)
 * D = Type ของข้อมูลที่จะส่งไป (Payload Data)
 */
const api = () => {
    return {
        get: async <RES>(url: string, config?: AxiosRequestConfig): Promise<RES> => {
            return await apiClient.get(url, config);
        },
        post: async <REQ = any, RES = any>(url: string, payload: REQ, config?: AxiosRequestConfig): Promise<RES> => {
            return await apiClient.post(url, payload, config);
        },
        put: async <REQ = any, RES = any>(url: string, payload: REQ, config?: AxiosRequestConfig): Promise<RES> => {
            return await apiClient.put(url, payload, config);
        },
        delete: async <REQ = any, RES = any>(url: string, payload?: REQ): Promise<RES> => {
            return await apiClient.delete(url, { data: payload });
        },
    };
};


export default api;