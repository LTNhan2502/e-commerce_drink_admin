'use client'
import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import LoadingOverlay from "@/components/reuse/loading.overlay";
import {toast} from "react-toastify";
import {addTable} from "@/utils/tableServices";

interface IAddTableModal {
    show: boolean;
    handleClose: () => void;
    originTable: ITable[];
    setOriginTable: Dispatch<SetStateAction<ITable[]>>;
}

const AddTableModal: React.FC<IAddTableModal> = ({ show, handleClose, originTable, setOriginTable }) => {
    const [tableNumber, setTableNumber] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const modalRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false);

    // Hàm huỷ thêm table
    const handleCancel = () => {
        setTableNumber('')
        handleClose()
    }

    // Hàm thêm table
    const handleSubmit = async () => {
        const alreadyHaveTable = originTable.find((oT) => oT.number_table === tableNumber)

        if(alreadyHaveTable){
            toast.info("Đã có số bàn này")
            return;
        }else if(!tableNumber.trim()){
            toast.info("Vui lòng nhập thông tin")
            return;
        }

        setLoading(true)
        try {
            // Call api thêm table
            const res = await addTable(tableNumber)

            setOriginTable((prev) => [...prev, res.data])
            toast.success("Thêm mới thành công")
        }catch(error){
            console.log("Failed to add anew table", error)
            toast.error("Thêm mới thất bại")
        }finally {
            setLoading(false)
            setTableNumber('')
            handleClose()
        }
    }

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

    return (
        <>
            {loading && <LoadingOverlay/>}
            <div
                className={`fixed inset-0 flex justify-center items-center transition-colors duration-200
                    ${isVisible ? 'visible bg-black/50 z-50' : 'invisible'}
                `}
            >
                <div
                    ref={modalRef}
                    className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-auto transition-all duration-200
                        ${show ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}
                    `}
                >
                    <div className='px-4 py-3 flex justify-center items-center border-b'>
                        <h2 className='text-lg font-medium'>Thêm mới bàn</h2>
                    </div>

                    <div className='px-3 py-2 mt-4'>
                        {/* Số bàn */}
                        <label className='relative block mb-4'>
                            <input
                                type='text'
                                value={tableNumber}
                                required
                                onChange={(e) => setTableNumber(e.target.value)}
                                className='border rounded-md w-full px-3 py-2 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer'
                            />
                            <span
                                className='absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75'>
                                Số bàn
                            </span>
                        </label>

                        <div className='px-4 py-3 flex justify-end mt-3'>
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
            </div>
        </>
    )
}

export default AddTableModal;