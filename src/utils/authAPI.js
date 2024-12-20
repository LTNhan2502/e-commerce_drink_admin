import instance from "@/utils/axios.config";

const loginAdmin = (username, password) => {
    const URL_API = "auth/login";
    const data = { username, password }
    return instance.post(URL_API, data);
}

const logoutAdmin = (refreshToken) => {
    const URL_API = "auth/logout";
    const data = { refreshToken };
    return instance.post(URL_API, data);
}

export { loginAdmin, logoutAdmin }