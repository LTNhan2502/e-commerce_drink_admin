'use client';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { addSize } from '@/utils/sizeServices';
import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import LoadingOverlay from '@/components/reuse/loading.overlay';

interface ModalSizeProps {
    show: boolean;
    handleClose: () => void;
    originSize: ISize[];
    setOriginSize: Dispatch<SetStateAction<ISize[]>>;
}

function ModalSize({ show, handleClose, originSize, setOriginSize }: ModalSizeProps) {
    const [size, setSize] = useState<string>('');
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

    // Hàm huỷ thêm
    const handleCancel = () => {
        setSize('')
        handleClose()
    }

    // Hàm thêm size
    const handleSubmit = async () => {
        const alreadyHaveSize = originSize.find((oS) => oS.size === size)

        if(alreadyHaveSize){
            toast.info("Đã có size này")
            return;
        }

        if (size.trim().length > 0) {
            setLoading(true);
            try {
                const res = await addSize(size);
                if (res) {
                    const data = res.data;
                    setOriginSize((prev) => [...prev, data]);
                    toast.success('Thêm size thành công!');
                    setSize('');
                    handleClose();
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi thêm size!');
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            toast.error('Vui lòng nhập size');
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
                        <h2 className='text-lg font-medium'>Thêm Size Mới</h2>
                    </div>
                    <div className='p-4'>
                        <Form>
                            <Form.Group className='mb-3' controlId='formBasicEmail'>
                                <label className="relative">
                                    <input
                                        type='size'
                                        id='size'
                                        name='size'
                                        value={size}
                                        autoFocus
                                        required
                                        onChange={(e) => setSize(e.target.value)}
                                        className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                                    />
                                    <span className="absolute rounded-md top-0 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                        Tên Size
                                    </span>
                                </label>
                                {/*{error && (<p className='text-red-600'>{error}</p>)}*/}
                            </Form.Group>
                        </Form>
                    </div>
                    <div className='px-4 py-3 flex justify-end'>
                        <button
                            onClick={handleCancel}
                            className='mr-2 px-4 py-2 font-medium bg-red-100 text-red-800 rounded-md hover:shadow-md hover:shadow-red-400 focus:outline-none transition-all'
                        >
                            Huỷ
                        </button>
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

export default ModalSize;
