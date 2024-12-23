'use client';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { addSize } from '@/utils/sizeServices';
import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import LoadingOverlay from '@/components/reuse/loading.overlay';

interface ModalSizeProps {
    show: boolean;
    handleClose: () => void;
    setOriginSize: Dispatch<SetStateAction<ISize[]>>;
}

function ModalSize({ show, handleClose, setOriginSize }: ModalSizeProps) {
    const [size, setSize] = useState<string>('');
    const [error, setError] = useState('');
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
        if (size.trim().length > 0) {
            setLoading(true);
            try {
                const res = await addSize(size);
                if (res) {
                    const data = res.data;
                    setOriginSize((prev) => [...prev, data]);
                    toast.success('Thêm size thành công!');
                    setSize('');
                    setError('');
                    handleClose();
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi thêm size!');
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            setError('Vui lòng nhập size');
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
                                <input
                                    type='size'
                                    id='size'
                                    name='size'
                                    placeholder='Nhập size'
                                    autoFocus
                                    className='w-full px-4 py-2 border hover:border-gray-400 rounded-md focus:shadow-md focus:shadow-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2 '
                                    onChange={(e) => setSize(e.target.value)}
                                />
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

export default ModalSize;
