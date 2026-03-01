import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "../constants/api"; // ✅ import ENDPOINTS để dùng chung

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/* ── REQUEST INTERCEPTOR ──
   Tự động đính kèm accessToken vào mọi request
   Người dùng không cần truyền token thủ công ở từng chỗ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── RESPONSE INTERCEPTOR ──
   Xử lý khi đang dùng app và accessToken vừa hết hạn (server trả 401)
   Tự động xin token mới rồi gửi lại request gốc — user không hay biết */
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Chỉ xử lý lỗi 401 (Unauthorized) và chỉ thử lại 1 lần (_retry)
    // Nếu không có _retry guard → sẽ bị vòng lặp vô tận khi refresh cũng trả 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // đánh dấu đã thử refresh rồi

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Gọi API refresh — dùng ENDPOINTS.REFRESH_TOKEN để đồng bộ với AuthContext
        const { data } = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.REFRESH_TOKEN}`,
          { refreshToken }
        );

        // Lưu accessToken mới
        localStorage.setItem("accessToken", data.accessToken);

        // Nếu backend trả refreshToken mới (Refresh Token Rotation) thì lưu luôn
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        // Cập nhật header của request gốc rồi gửi lại
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);

      } catch {
        // Refresh thất bại (refreshToken hết hạn hoặc bị thu hồi)
        // → Xóa session và đưa người dùng về trang login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;