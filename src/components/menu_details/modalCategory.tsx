'use client';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import LoadingOverlay from '@/components/reuse/loading.overlay';
import {addCategory} from "@/utils/categoryServices";

interface ModalCategoryProps {
    show: boolean;
    handleClose: () => void;
    originCategory: ICategory[];
    setOriginCategory: Dispatch<SetStateAction<ICategory[]>>;
}

function ModalCategory({ show, handleClose, originCategory, setOriginCategory }: ModalCategoryProps) {
    const [category, setCategory] = useState<string>('');
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async () => {
        const alreadyHaveCategory = originCategory.find((oC) => oC.name === category)

        if(alreadyHaveCategory){
            toast.info("Đã có category này")
            return;
        }

        if (category.trim().length > 0) {
            setLoading(true);
            try {
                const res = await addCategory(category)
                if (res) {
                    const data = res.data;
                    setOriginCategory((prev) => [...prev, data]);
                    toast.success('Thêm category thành công!');
                    setCategory('');
                    handleClose();
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi thêm category!');
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            toast.error('Vui lòng nhập category');
        }
    };


    return (
        <>
            {loading && <LoadingOverlay />}
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
                        <h2 className='text-lg font-medium'>Thêm Category Mới</h2>
                    </div>
                    <div className='p-4'>
                        <Form>
                            <Form.Group className='mb-3' controlId='formBasicEmail'>
                                <label className="relative">
                                    <input
                                        type='category'
                                        id='category'
                                        name='category'
                                        autoFocus
                                        required
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                                    />
                                    <span className="absolute rounded-md top-0 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                        Tên Category
                                    </span>
                                </label>
                                {/*{error && (<p className='text-red-600'>{error}</p>)}*/}
                            </Form.Group>
                        </Form>
                    </div>
                    <div className='px-4 py-3 flex justify-end'>
                        <button
                            onClick={handleSubmit}
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

export default ModalCategory;
