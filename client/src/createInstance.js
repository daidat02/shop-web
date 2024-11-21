import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { updateUser } from "./redux/slice/auth";

class TokenManager {
    constructor(refreshTokenUrl = '/auth/refresh') {
        this.refreshTokenUrl = refreshTokenUrl;
        this.cachedToken = null;
        this.refreshPromise = null;
    }

    isTokenExpired(token, bufferTime = 5 * 60 * 1000) {
        if (!token) return true;
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp * 1000 < Date.now() + bufferTime;
        } catch {
            return true;
        }
    }

    async refreshToken() {
        // Nếu đang có promise refresh, trả về promise đó
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = axios.post(this.refreshTokenUrl, {}, { 
            withCredentials: true 
        })
        .then(response => {
            this.cachedToken = response.data;
            return response.data;
        })
        .catch(error => {
            console.error("Token refresh failed:", error);
            throw error;
        })
        .finally(() => {
            this.refreshPromise = null;
        });

        return this.refreshPromise;
    }

    createAxiosInstance(user, dispatch) {
        const instance = axios.create();

        instance.interceptors.request.use(
            async (config) => {
                // Bỏ qua request refresh token
                if (config.url?.includes('/auth/refresh')) {
                    return config;
                }

                let accessToken = user?.accessToken;

                // Luôn kiểm tra và refresh token nếu cần
                if (this.isTokenExpired(accessToken)) {
                    try {
                        const data = await this.refreshToken();
                        if (data?.accessToken) {
                            accessToken = data.accessToken;
                            // Cập nhật token mới vào Redux
                            if (dispatch) {
                                dispatch(updateUser({
                                    ...user,
                                    accessToken: data.accessToken
                                }));
                            }
                        }
                    } catch (error) {
                        // Xử lý lỗi refresh token (ví dụ: logout)
                        console.error("Failed to refresh token:", error);
                    }
                }

                if (accessToken) {
                    config.headers["token"] = `Bearer ${accessToken}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalConfig = error.config;

                // Thử refresh token khi nhận lỗi 401 
                if (error.response?.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;

                    try {
                        const data = await this.refreshToken();
                        if (data?.accessToken) {
                            // Cập nhật token mới
                            if (dispatch) {
                                dispatch(updateUser({
                                    ...user,
                                    accessToken: data.accessToken
                                }));
                            }
                            originalConfig.headers["token"] = `Bearer ${data.accessToken}`;
                            return instance(originalConfig);
                        }
                    } catch (refreshError) {
                        // Xử lý lỗi refresh (ví dụ: logout)
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return instance;
    }
}

// Tạo instance global
export const tokenManager = new TokenManager();

// Utility để tạo axios instance
export const createAxiosInstance = (user, dispatch) => {
    return tokenManager.createAxiosInstance(user, dispatch);
};

export default tokenManager;