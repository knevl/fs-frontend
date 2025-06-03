import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-hot-toast';

const api: AxiosInstance = axios.create({
baseURL: API_URL,
timeout: 10000, // 10 секунд таймаута
headers: { 'Content-Type': 'application/json'},
});

api.interceptors.request.use(
(config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-player-token'] = token;
    }
    return config;
},
(error: AxiosError) => {
    return Promise.reject(error);
}
);

api.interceptors.response.use(
(response: AxiosResponse) => response,
(error: AxiosError) => {
    if (error.response) {
    const message = (error.response.data as any)?.message || 'Произошла ошибка';
    toast.error(message);
    } else if (error.request) {
    toast.error('Сервер не отвечает. Проверьте интернет-соединение.');
    } else {
    toast.error('Ошибка при отправке запроса.');
    }
    return Promise.reject(error);
}
);

export const ApiService = {
get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return api.get<T>(endpoint, config).then(response => response.data);
},

post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.post<T>(endpoint, data, config).then(response => response.data);
},

put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.put<T>(endpoint, data, config).then(response => response.data);
},

patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.patch<T>(endpoint, data, config).then(response => response.data);
},

delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return api.delete<T>(endpoint, config).then(response => response.data);
}
};

export interface ApiError {
message: string;
status?: number;
data?: any;
}