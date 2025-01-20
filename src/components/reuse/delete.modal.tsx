'use client'
import {useEffect, useRef, useState} from 'react';

type ReactValue = string | number | boolean | null | undefined;

interface DeleteModalProps {
    show: boolean;
    handleClose: () => void;
    selectedObject: Record<string, ReactValue> | null; // Linh hoạt để nhận mọi đối tượng
    selectType: string;
    onConfirm:  () => void ;
}

function DeleteModal({ show, handleClose, selectedObject, selectType, onConfirm }: DeleteModalProps) {
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
        <>
            <div
                className={`fixed inset-0 flex items-center justify-center transition-colors duration-200
                ${isVisible ? 'visible bg-black/50 z-50' : 'invisible'}`}
            >
                <div
                    ref={popupRef}
                    className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-auto transition-all duration-200
                    ${show ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
                >
                    <div className='border-b px-4 py-3 flex justify-center items-center'>
                        <h2 className='text-lg font-medium'>Xác nhận xoá</h2>
                        {/*<button onClick={handleClose} className='text-gray-500 hover:text-gray-700 focus:outline-none'>*/}
                        {/*    ✖*/}
                        {/*</button>*/}
                    </div>
                    <div className='p-4'>
                        Bạn có muốn xoá {selectType === "order" ? "order của" : selectType} <b>{selectedObject?.size || selectedObject?.name}</b> không?
                    </div>
                    <div className='px-4 py-3 flex justify-end items-center'>
                        <button
                            onClick={handleClose}
                            className='px-4 py-2 font-medium bg-gray-100 text-gray-600 rounded-md hover:shadow-md hover:shadow-gray-400 focus:outline-none transition-all mr-4'
                        >
                            Huỷ
                        </button>
                        <button
                            onClick={onConfirm}
                            className='px-4 py-2 font-medium bg-red-100 text-red-800 rounded-md hover:shadow-md hover:shadow-red-400 focus:outline-none transition-all'
                        >
                            Xoá
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteModal;
