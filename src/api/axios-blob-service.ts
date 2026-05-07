import { getLoginStorage, removeLoginStorage } from '@/helpers/set-storage';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const URL = `${import.meta.env.VITE_APP_URL_API}`;

const axiosServiceDownloadfile: AxiosInstance = axios.create({
    baseURL: URL,
    headers: {
        "Content-Type": "application/json",
    },
    responseType: 'blob', // สำคัญมากสำหรับการโหลดไฟล์
});

axiosServiceDownloadfile.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { token } = getLoginStorage();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosServiceDownloadfile.interceptors.response.use(
    (response: AxiosResponse) => {
        // สำหรับ blob เรามักจะต้องการข้อมูลใน response.data ตรงๆ
        return response.data;
    },
    async (error) => {
        const { response } = error;
        const responseUrl = response?.request?.responseURL || "";
        const isLogin = responseUrl.split("/").pop() === "login";

        const isUnauthorized = response?.status === 401 && !isLogin;

        if (isUnauthorized) {
            removeLoginStorage();
            window.location.href = '/signin';
            return Promise.reject(error);
        }

        // กรณีดาวน์โหลดไฟล์พลาด Backend อาจส่ง JSON Error มา
        // แต่เนื่องจาก responseType เป็น blob เราต้องแปลงกลับเป็น JSON ก่อนเพื่ออ่าน Error
        if (response?.data instanceof Blob && response.data.type === 'application/json') {
            const text = await response.data.text();
            const errorData = JSON.parse(text);
            return Promise.reject(errorData);
        }

        return Promise.reject(response?.data || error);
    }
);

/**
 * Service Wrapper สำหรับดาวน์โหลดไฟล์
 * รีเทิร์นค่าเป็น Promise<Blob>
 */
export const serviceDownloadFile = () => {
    return {
        get: async (url: string, config?: AxiosRequestConfig): Promise<Blob> => {
            return await axiosServiceDownloadfile.get(url, config);
        },
        post: async (url: string, data?: any, config?: AxiosRequestConfig): Promise<Blob> => {
            return await axiosServiceDownloadfile.post(url, data, config);
        },
        put: async (url: string, data?: any, config?: AxiosRequestConfig): Promise<Blob> => {
            return await axiosServiceDownloadfile.put(url, data, config);
        },
        delete: async (url: string, payload?: any): Promise<Blob> => {
            return await axiosServiceDownloadfile.delete(url, { data: payload });
        },
    };
};

const apidownloadfile = serviceDownloadFile();
export default apidownloadfile