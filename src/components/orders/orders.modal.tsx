'use client';

import React, {Dispatch, SetStateAction} from "react";

interface Order {
    customerName: string;
    product: string;
    price: number;
    quantity: number;
    status: string;
    note?: string; // Thuộc tính này là tùy chọn (có thể không có)
}

interface OrdersModalProps {
    selectedOrder: Order | null;
    setSelectedOrder: Dispatch<SetStateAction<IOrder | null>>;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ selectedOrder, setSelectedOrder }) => {
    return (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-colors ${
                selectedOrder ? 'visible bg-black bg-opacity-50' : 'invisible'
            }`}
        >
            <div
                className={`bg-white rounded-md p-6 w-3/4 max-w-2xl shadow-lg transition-all ${
                    selectedOrder ? 'scale-100 opacity-100' : 'scale-125 opacity-0'
                }`}
            >
                <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>
                {selectedOrder && (
                    <>
                        <p>
                            <span className="font-semibold">Tên khách hàng: </span>
                            {selectedOrder.customerName}
                        </p>
                        <p>
                            <span className="font-semibold">Sản phẩm: </span>
                            {selectedOrder.product}
                        </p>
                        <p>
                            <span className="font-semibold">Số lượng: </span>
                            {selectedOrder.quantity}
                        </p>
                        <p>
                            <span className="font-semibold">Tổng giá: </span>
                            {(selectedOrder.price * selectedOrder.quantity).toLocaleString()} VNĐ
                        </p>
                        <p>
                            <span className="font-semibold">Trạng thái: </span>
                            {selectedOrder.status}
                        </p>
                        {selectedOrder.note && (
                            <p>
                                <span className="font-semibold">Ghi chú: </span>
                                {selectedOrder.note}
                            </p>
                        )}
                    </>
                )}
                <button
                    className="mt-4 py-2 px-4 font-semibold bg-red-200 text-red-800 rounded-md"
                    onClick={() => setSelectedOrder(null)}
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default OrdersModal;
