'use client'
import { useEffect, useRef, useState } from "react";

interface ModalSizeProps {
    show: boolean;
    handleClose: () => void;
}

function ModalSize({ show, handleClose }: ModalSizeProps) {
    const popupRef = useRef<HTMLDivElement>(null); // Tạo ref để tham chiếu đến modal
    const [isVisible, setIsVisible] = useState(false); // Trạng thái kiểm soát animation

    // Kích hoạt trạng thái visible khi show thay đổi
    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            // Đợi animation đóng hoàn tất trước khi đặt invisible
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer); // Cleanup khi unmount
        }
    }, [show]);

    // Nhấn ra ngoài thì đóng popup
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, handleClose]);

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-colors duration-200
            ${isVisible ? 'visible bg-black bg-opacity-50 z-50' : 'invisible'}`}
        >
            <div
                ref={popupRef}
                className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-auto transition-all duration-200
                ${show ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
            >
                <div className="border-b px-4 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-medium">Thêm Size Mới</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        ✖
                    </button>
                </div>
                <div className="p-4">
                    {/* Thêm form input ở đây */}
                </div>
                <div className="border-t px-4 py-3 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalSize;
