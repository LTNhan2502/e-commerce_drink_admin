import StyleWrapper from "@/components/registry/style.registry";
import { ToastContainer } from "react-toastify";

export default function Template({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <StyleWrapper>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </StyleWrapper>
    );
}