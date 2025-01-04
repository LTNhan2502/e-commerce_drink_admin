import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import UploadImage from '@/components/reuse/upload.file';
import LoadingOverlay from '@/components/reuse/loading.overlay';
import { addMenu } from '@/utils/menuServices';
import { toast } from 'react-toastify';
import { uploadFile } from '@/utils/fileServices';

interface IAddMenuModal {
    show: boolean;
    handleClose: () => void;
    category: ICategory[];
    setOriginMenu: Dispatch<SetStateAction<IProduct[]>>;
}

const AddMenuModal: React.FC<IAddMenuModal> = ({ show, handleClose, category, setOriginMenu }) => {
    const [productName, setProductName] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false); // Kiểm soát animation
    const [loading, setLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null); // Tạo ref để tham chiếu tới vị trí của modal

    // Hàm thay đổi tên sản phẩm
    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setProductName(e.target.value);
    };

    // Hàm thay đổi category
    const handleChangeCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    // Hàm thêm ảnh
    const handleUploadFile = async () => {
        try {
            if (!file) throw new Error('No file selected');

            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadFile(formData);

            if (res) {
                console.log('Upload successful', res);
                return res.data.data.publicId;
            }
        } catch (error) {
            console.log('Failed to upload file', error);
            throw error; // Ném lỗi để xử lý ở handleAddMenu
        }
    };

    // Hàm thêm menu
    const handleAddMenu = async () => {
        if (!productName || !selectedCategory || !file) {
            toast.info('Vui lòng nhập thông tin cần thiết');
            return;
        }

        setLoading(true);

        try {
            // Upload ảnh và lấy `menuImage`
            const menuImage = await handleUploadFile();

            if (!menuImage) {
                console.log('Upload failed');
            }

            // Tạo payload
            const reqData = {
                name: productName,
                category_id: [selectedCategory],
                images: [menuImage]
            };

            //Gửi request để thêm menu
            if (reqData) {
                const res = await addMenu(reqData);
                console.log('>>Check res addMenu', res);

                if (res) {
                    const data = res.data;
                    setOriginMenu((prev) => [...prev, data]);
                    toast.success('Thêm mới thành công');
                }
            }
        } catch (error) {
            console.log('Failed to add menu', error);
            toast.error('Thêm mới thất bại');
        } finally {
            setProductName('')
            setSelectedCategory('')
            setFile(null)
            handleClose()
            setLoading(false);
        }
    };

    // Kích hoạt animation, đợi animation
    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [show]);

    // Nhấn ra ngoài thì đóng modal
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
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

    // Check initialValue
    useEffect(() => {
        console.log('>>Check init', productName, selectedCategory, file);
    }, [productName, selectedCategory, file]);

    return (
        <>
            {loading && <LoadingOverlay />}
            <div
                className={`fixed inset-0 flex items-center justify-center transition-colors duration-200
                ${isVisible ? 'visible bg-black bg-opacity-50 z-50' : 'invisible'}`}
            >
                <div
                    ref={modalRef}
                    className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-auto transition-all duration-200
                        ${show ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
                >
                    <div className='px-4 py-3 flex justify-center items-center border-b'>
                        <h2 className='text-lg font-medium'>Thêm mới sản phẩm</h2>
                    </div>

                    <div className='px-3 py-2 mt-4'>
                        {/* Tên */}
                        <label className='relative'>
                            <input
                                type='text'
                                required
                                onChange={handleChangeName}
                                className='border rounded-md w-full px-3 py-2 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer'
                            />
                            <span className='absolute rounded-md top-0 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75'>
                                Tên sản phẩm
                            </span>
                        </label>

                        {/* Category */}
                        <select
                            name='select-category'
                            id='select-category'
                            onChange={handleChangeCategory}
                            className='w-full px-3 py-2 mt-4 border rounded-md hover:border-gray-400 focus:outline-none focus:shadow-md focus:shadow-indigo-400 transition-all'
                        >
                            <option value='initialValue'>Chọn category</option>
                            {category.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Upload ảnh */}
                        <UploadImage setFile={setFile} image={image} setImage={setImage} />
                    </div>
                    <div className='px-3 py-2 flex justify-end items-center'>
                        <button
                            className='px-4 py-2 font-medium bg-indigo-100 text-indigo-800 rounded-md hover:shadow-md hover:shadow-indigo-400 transition-all'
                            onClick={handleAddMenu}
                        >
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddMenuModal;
