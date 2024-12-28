import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import UploadImage from "@/components/reuse/upload.file";

interface IAddMenuModal {
    show: boolean;
    handleClose: () => void;
    handleAddMenu: () => void;
}

const AddMenuModal: React.FC<IAddMenuModal> = ({ show, handleClose, handleAddMenu }) => {
    const [productName, setProductName] = useState<string>("");
    const [category, setCategory] = useState<ICategory[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false); // Kiểm soát animation
    const modalRef = useRef<HTMLDivElement>(null) // Tạo ref để tham chiếu tới vị trí của modal

    // Hàm thay đổi tên sản phẩm
    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setProductName(e.target.value);
    }

    // Kích hoạt animation, đợi animation
    useEffect(() => {
        if(show){
            setIsVisible(true);
        }else{
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [show]);

    // Nhấn ra ngoài thì đóng modal
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(modalRef.current && !modalRef.current.contains(e.target as Node)){
                handleClose()
            }
        }

        if(show){
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [show, handleClose]);

    return(
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

                <div className='px-3 py-2'>
                    {/* Tên */}
                    <input
                        type="text"
                        className='w-full px-2 py-1 border rounded-md hover:border-gray-400 focus:outline-none focus:shadow-md focus:shadow-indigo-400 focus:ring-1 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2'
                        placeholder='Nhập tên'
                        onChange={handleChangeName}
                    />

                    {/* Category */}

                    {/* Upload ảnh */}
                    <UploadImage setFile={setFile} image={image} setImage={setImage}/>
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
    )
}

export default AddMenuModal;