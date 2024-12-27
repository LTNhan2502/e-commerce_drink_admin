'use client';
import { createTopping } from '@/utils/toppingClient';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoadingOverlay from "@/components/reuse/loading.overlay";

interface ModalToppingProps {
    show: boolean;
    handleClose: () => void;
    setOriginTopping: Dispatch<SetStateAction<ITopping[]>>;
}

function ModalTopping({ show, handleClose, setOriginTopping }: ModalToppingProps) {
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
        let flag = false;

        // Kiểm tra các input trống
        if (topping.name === '' || topping.price === '') {
            flag = true;
            toast.error('Vui lòng nhập đầy đủ thông tin');
        }

        // Kiểm tra price có phải là số hay không
        if (isNaN(Number(topping.price))) {
            flag = true;
            toast.error('Price phải là số');
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
                            <Form.Group className='mb-3' controlId='formBasicEmail'>
                                <input
                                    type='name'
                                    id='name'
                                    name='name'
                                    placeholder='Nhập topping'
                                    autoFocus
                                    className='mb-5 w-full px-4 py-2 border hover:border-gray-400 rounded-md focus:shadow-md focus:shadow-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2 '
                                    onChange={(e) => setTopping({ ...topping, name: e.target.value })}
                                />

                                <input
                                    type='price'
                                    id='price'
                                    name='price'
                                    placeholder='Nhập price'
                                    autoFocus
                                    className='mv-5 w-full px-4 py-2 border hover:border-gray-400 rounded-md focus:shadow-md focus:shadow-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2 '
                                    onChange={(e) => setTopping({ ...topping, price: e.target.value })}
                                />
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
