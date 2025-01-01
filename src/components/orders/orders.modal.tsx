'use client';

import React, {useEffect, useRef, useState} from "react";

interface OrdersModalProps {
    show: boolean;
    handleClose: () => void;
    selectedOrder: IOrder | null;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ show, handleClose, selectedOrder }) => {
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

    // Kiểm tra selectedOrder
    useEffect(() => {
        console.log(">>Chek chek", selectedOrder?.order_details);
    }, [selectedOrder])

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-colors
            ${isVisible ? 'visible bg-black bg-opacity-50 z-50' : 'invisible'}`}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-md p-6 w-3/4 max-w-2xl max-h-2xl shadow-lg transition-all ml-[75px]
                ${show ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
            >
                <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng của {selectedOrder?.name}</h2>
                <div className='grid grid-cols-1 gap-6 mt-6'>
                    {selectedOrder && selectedOrder.order_details.map((selectedOrder, index) => {
                        // Tính tổng giá topping
                        const toppingTotal =  selectedOrder.topping.reduce((toppingSum: number, topping: IOrderTopping) => {
                            return toppingSum + topping.price;
                        }, 0)

                        // Tính tổng sản phẩm (sản phẩm + topping) * quantity
                        const totalPrice = toppingTotal + selectedOrder.price * selectedOrder.quantity;
                        return (
                            <div
                                key={index}
                                className='relative flex items-center bg-white shadow-md rounded-md overflow-hidden border border-gray-200 p-[10px]'
                            >
                                {/* Nội dung bên phải */}
                                <div className='flex flex-col flex-1'>

                                    <p>
                                        <span className="font-sm text-xs text-gray-500">Sản phẩm: </span>
                                        <span className='font-medium text-gray-800'>{selectedOrder.name}</span>
                                    </p>
                                    <p>
                                        <span className="font-sm text-xs text-gray-500">Đơn giá: </span>
                                        <span className='font-medium text-gray-800'>{selectedOrder.price.toLocaleString()} VNĐ</span>
                                    </p>
                                    <p>
                                        <span className="font-sm text-xs text-gray-500">Size: </span>
                                        <span className='font-medium text-gray-800'>{selectedOrder.size}</span>
                                    </p>
                                    <p>
                                        <span className="font-sm text-xs text-gray-500">Topping: </span>
                                        <div>
                                            {selectedOrder.topping && selectedOrder.topping.length > 0 ? (
                                                selectedOrder.topping.map((topping, index) => (
                                                    <div key={index} className="flex items-center space-x-2 ml-4">
                                                        <span className="font-medium">{topping.name}</span>
                                                        <span className="text-gray-500">({topping.price.toLocaleString()} VNĐ)</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">Chưa có topping đính kèm</span>
                                            )}
                                        </div>


                                    </p>
                                    <p>
                                        <span className="font-sm text-xs text-gray-500">Số lượng: </span>
                                        <span className='font-medium text-gray-800'>{selectedOrder.quantity}</span>
                                    </p>
                                    <p>
                                        <span className="font-sm text-xs text-gray-500">Tổng giá: </span>
                                        <span className='font-medium text-gray-800'>
                                        {totalPrice.toLocaleString()} VNĐ
                                    </span>

                                    </p>
                                    {selectedOrder.description && (
                                        <p>
                                            <span className="font-sm text-xs text-gray-500">Ghi chú: </span>
                                            <span
                                                className='font-medium text-gray-800'>{selectedOrder.description}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
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
