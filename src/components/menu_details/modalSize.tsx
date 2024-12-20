import { useState } from 'react';
import { addSize } from '@/utils/sizeServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from 'react-bootstrap';
interface ModalSizeProps {
    show: boolean;
    handleClose: () => void;
}

function ModalSize({ show, handleClose }: ModalSizeProps) {
    const [size, setSize] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (size.trim().length > 0) {
            try {
                await addSize(size);
                toast.success('Thêm size thành công!');
                setSize('');
                handleClose();
            } catch (error) {
                toast.error('Có lỗi xảy ra khi thêm size!');
                console.error(error);
            }
        } else {
            setError('Vui lòng nhập size');
            toast.error('Vui lòng nhập size');
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 flex items-center justify-center transition-colors
         ${show ? 'visible bg-black bg-opacity-50 z-50' : 'invisible'}`}
            >
                <div
                    className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-auto transition-all
            ${show ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}
            `}
                >
                    <div className='border-b px-4 py-3 flex justify-between items-center'>
                        <h2 className='text-lg font-medium'>Thêm Size Mới</h2>
                        <button onClick={handleClose} className='text-gray-500 hover:text-gray-700 focus:outline-none'>
                            ✖
                        </button>
                    </div>
                    <div className='p-4'>
                        <Form>
                            <Form.Group className='mb-3' controlId='formBasicEmail'>
                                <Form.Label>Size</Form.Label>
                                <input
                                    type='size'
                                    id='size'
                                    name='size'
                                    placeholder='Nhập size'
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    onChange={(e) => setSize(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </div>
                    <div className='border-t px-4 py-3 flex justify-end'>
                        <button
                            onClick={handleSubmit}
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none'
                        >
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
            />
        </>
    );
}

export default ModalSize;
