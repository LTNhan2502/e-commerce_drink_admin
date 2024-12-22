import axios from "axios";
import Cookies from "js-cookie";

// Tạo một instance Axios
const instance = axios.create({
    baseURL: "https://order-drink.vercel.app",
    withCredentials: true, // Đảm bảo gửi cookies trong request
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor cho request
instance.interceptors.request.use(
    (config) => {
        // Lấy token từ Cookies
        const token = Cookies.get("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // Xóa header Authorization nếu không có token
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => {
        // Xử lý lỗi request
        return Promise.reject(error);
    }
);

// Interceptor cho response
instance.interceptors.response.use(
    (response) => {
        // Trả về response nếu không có lỗi
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra lỗi liên quan đến token hết hạn (401)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu rằng request này đã thử làm mới token

            const refreshToken = Cookies.get("refresh_token");
            if (!refreshToken) {
                // Nếu không có refresh token thì chuyển hướng tới trang login
                console.warn("Không có refresh token. Vui lòng đăng nhập lại.");
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");
                window.location.href = "/auth/login";
                return Promise.reject(error);
            }

            try {
                console.log("> Đang gửi yêu cầu làm mới token...");
                // Gọi API làm mới token
                // Không dùng instance vì nó sẽ phải thông qua interceptor một lần nữa dẫn tới infinite loop
                const res = await axios.post("https://order-drink.vercel.app/auth/refreshToken", {
                    refreshToken,
                });

                console.log(">> Đã làm mới token thành công:", res.data);

                // Lấy access token mới từ phản hồi
                const newAccessToken = res.data.data.accessToken;
                if (newAccessToken) {
                    // Lưu lại token mới
                    Cookies.set("access_token", newAccessToken);

                    // Cập nhật header Authorization với token mới
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Thử lại request ban đầu
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                console.error(">> Làm mới token thất bại:", refreshError.response || refreshError);

                // Xóa token và chuyển hướng tới trang login nếu refresh token hết hạn
                if (refreshError.response?.status === 401) {
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");
                    console.warn("Refresh token đã hết hạn. Vui lòng đăng nhập lại.");
                    window.location.href = "/auth/login";
                }

                return Promise.reject(refreshError);
            }
        }

        // Trả về lỗi nếu không phải lỗi liên quan đến token
        return Promise.reject(error);
    }
);

export default instance;
