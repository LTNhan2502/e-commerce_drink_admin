'use client';
import { createTopping } from '@/utils/toppingClient';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoadingOverlay from "@/components/reuse/loading.overlay";

interface ModalToppingProps {
    show: boolean;
    handleClose: () => void;
    originTopping: ITopping[];
    setOriginTopping: Dispatch<SetStateAction<ITopping[]>>;
}

function ModalTopping({ show, handleClose, originTopping, setOriginTopping }: ModalToppingProps) {
    const popupRef = useRef<HTMLDivElement>(null); // Tạo ref để tham chiếu đến modal
    const [isVisible, setIsVisible] = useState(false); // Trạng thái kiểm soát animation
    const [topping, setTopping] = useState({ name: '', price: '' }); // Lưu các mảng input
    const [loading, setLoading] = useState(false);

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

    // Thêm topping
    const handleAddTopping = async () => {
        const alreadyHaveTopping = originTopping.find((oT) => oT.name === topping.name);
        let flag = false;

        // Kiểm tra các input trống
        if (topping.name === '' || topping.price === '') {
            flag = true;
            toast.info('Vui lòng nhập đầy đủ thông tin');
        }

        // Kiểm tra price có phải là số hay không
        if (isNaN(Number(topping.price))) {
            flag = true;
            toast.info('Price phải là số');
        }

        // Kiểm tra trùng
        if(alreadyHaveTopping){
            flag = true;
            toast.info("Đã có topping này")
        }

        if (!flag) {
            setLoading(true)
            try {
                const res = await createTopping(topping.name, topping.price);
                if (res) {
                    const data = res.data;
                    setOriginTopping((prev) => [...prev, data]);
                    setTopping({ name: '', price: '' });
                    toast.success('Thêm topping thành công');

                    handleClose();
                }
                handleClose();
            } catch (error) {
                toast.error('Thêm topping thất bại');
                console.log("Failed to add topping", error);
            }finally {
                setLoading(false)
            }
        }
    };

    return (
        <>
            {loading && <LoadingOverlay/>}
            <div
                className={`fixed inset-0 flex items-center justify-center transition-colors duration-200
                ${isVisible ? 'visible bg-black bg-opacity-50 z-50' : 'invisible'}`}
            >
                <div
                    ref={popupRef}
                    className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-auto transition-all duration-200
                    ${show ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
                >
                    <div className='border-b px-4 py-3 flex justify-center items-center'>
                        <h2 className='text-lg font-medium'>Thêm Topping Mới</h2>
                    </div>
                    <div className='p-4'>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                {/* Input Tên Topping */}
                                <label className="relative block mb-4">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        autoFocus
                                        required
                                        onChange={(e) => setTopping({ ...topping, name: e.target.value })}
                                        className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                                    />
                                    <span className="absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                        Tên Topping
                                    </span>
                                </label>

                                {/* Input Giá */}
                                <label className="relative block">
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        required
                                        onChange={(e) => setTopping({ ...topping, price: e.target.value })}
                                        className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                                    />
                                    <span className="absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                        Giá
                                    </span>
                                </label>
                            </Form.Group>

                        </Form>
                    </div>
                    <div className='border-t px-4 py-3 flex justify-end'>
                        <button
                            onClick={handleAddTopping}
                            className='px-4 py-2 font-medium bg-indigo-100 text-indigo-800 rounded-md hover:shadow-md hover:shadow-indigo-400 focus:outline-none transition-all'
                        >
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalTopping;
