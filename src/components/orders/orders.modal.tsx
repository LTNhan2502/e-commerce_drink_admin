'use client';

import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import Image from "next/image";

interface Order {
    customerName: string;
    product: string;
    price: number;
    quantity: number;
    status: string;
    note?: string; // Thuộc tính này là tùy chọn (có thể không có)
}

interface OrdersModalProps {
    show: boolean;
    handleClose: () => void;
    selectedOrder: IOrder | null;
    setSelectedOrder: Dispatch<SetStateAction<IOrder | null>>;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ show, handleClose, selectedOrder, setSelectedOrder }) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const modalRef = useRef<HTMLDivElement>(null) // Tạo ref để tham chiếu tới vị trí của modal

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

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-colors
            ${isVisible ? 'visible bg-black bg-opacity-50' : 'invisible'}`}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-md p-6 w-3/4 max-w-2xl max-h-2xl shadow-lg transition-all ml-[75px]
                ${show ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
            >
                <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng của {selectedOrder?.name}</h2>
                <div className='grid grid-cols-1 gap-6 mt-6'>
                    {selectedOrder && selectedOrder.order_details.map((selectedOrder, index) => (
                        <div
                            key={index}
                            className='relative flex items-center bg-white shadow-md rounded-md overflow-hidden border border-gray-200 p-[10px]'
                        >
                            {/* Hình ảnh bên trái */}
                            <div className="w-16 h-16 mr-4">
                                <Image
                                    src={'https://ui-avatars.com/api/?backgound=c7d2fe&color=3730a3&bold=true'}
                                    alt="Product"
                                    className="object-cover h-full w-full rounded-md"
                                    width={150}
                                    height={150}
                                />
                            </div>

                            {/* Nội dung bên phải */}
                            <div className='flex flex-col flex-1'>

                                <p>
                                    <span className="font-sm text-xs text-gray-500">Sản phẩm: </span>
                                    <span className='font-medium text-gray-800'>{selectedOrder.name}</span>
                                </p>
                                <p>
                                    <span className="font-sm text-xs text-gray-500">Số lượng: </span>
                                    <span className='font-medium text-gray-800'>{selectedOrder.quantity}</span>
                                </p>
                                <p>
                                    <span className="font-sm text-xs text-gray-500">Tổng giá: </span>
                                    <span className='font-medium text-gray-800'>
                                        {(selectedOrder.price * selectedOrder.quantity).toLocaleString()} VNĐ
                                    </span>

                                </p>
                                {selectedOrder.description && (
                                    <p>
                                        <span className="font-sm text-xs text-gray-500">Ghi chú: </span>
                                        <span className='font-medium text-gray-800'>{selectedOrder.description}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-end'>
                    <button
                        className="mt-4 py-2 px-4 font-semibold bg-red-200 text-red-800 rounded-md hover:shadow-md hover:shadow-red-400 transition-all"
                        onClick={handleClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersModal;
