import AdminLogin from "@/components/auth/admin.login";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Đăng nhập",
    description: "Đăng nhập vào AnTea"
}

const LoginPage = () => {
    return(
        <AdminLogin/>
    )
}

export default LoginPage;