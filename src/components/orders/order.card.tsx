'use client'

import { useState } from 'react';
import { AiOutlinePlusCircle } from "react-icons/ai";
import Image from "next/image";

interface IOrders {
    customerName: string;
    product: string;
    price: number;
    quantity: number;
    size: string;
    topping: string[];
    note: string;
    handler: string;
    time: string;
    status: string;
}

const ManageOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const orders: IOrders[] = Array(10).fill({
        customerName: "Nguyễn Văn A",
        product: "Trà sữa matcha",
        price: 45000,
        quantity: 2,
        size: "L",
        topping: "Trân châu đen, Trân châu trắng",
        note: "Ít đá, thêm đường",
        handler: "Admin01",
        time: "18:30 - 19/12/2024",
        status: "pending",
    });

    const handleModalClose = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="px-3 py-2">
            {/* Thông tin chung */}
            <div className="rounded-md p-3 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-2xl">Đơn hàng</h3>
                        <h5 className="font-normal">Quản lí đơn hàng</h5>
                    </div>
                    <div>
                        <button className="inline-flex items-center bg-indigo-200 text-indigo-800 hover:shadow-md transition-all hover:shadow-indigo-300 rounded-md p-1 text-sm font-medium gap-x-2">
                            <AiOutlinePlusCircle className="text-base" />
                            Thêm đơn hàng
                        </button>
                    </div>
                </div>
            </div>

            {/* Danh sách đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {orders.map((order, index) => (
                    <div
                        key={index}
                        className="flex flex-col bg-white shadow-md rounded-md overflow-hidden p-4"
                    >
                        {/* Nội dung */}
                        <div className="flex flex-col flex-1 p-4 space-y-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                Tên khách hàng:{" "}
                                <span className="font-normal">{order.customerName}</span>
                            </h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <p>
                                    <span className="font-semibold">Sản phẩm: </span>
                                    {order.product}
                                </p>
                                <p>
                                    <span className="font-semibold">Số lượng: </span>
                                    {order.quantity}
                                </p>
                                <p>
                                    <span className="font-semibold">Tổng giá: </span>
                                    {(order.price * order.quantity).toLocaleString()} VNĐ
                                </p>
                                <p>
                                    <span className="font-semibold">Trạng thái: </span>
                                    {order.status === "pending"
                                        ? "Đang xử lý"
                                        : order.status === "completed"
                                            ? "Hoàn thành"
                                            : "Đã hủy"}
                                </p>
                                <p>
                                    <span className="font-semibold">Ngày: </span>
                                    {order.time}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="mt-4 py-2 px-4 font-semibold w-full bg-indigo-200 text-indigo-800 hover:shadow-md transition-all hover:shadow-indigo-300 rounded-md"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md shadow-lg w-11/12 max-w-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-semibold">Tên khách hàng:</span> {selectedOrder.customerName}</p>
                            <p><span className="font-semibold">Sản phẩm:</span> {selectedOrder.product}</p>
                            <p><span className="font-semibold">Số lượng:</span> {selectedOrder.quantity}</p>
                            <p><span className="font-semibold">Tổng giá:</span> {(selectedOrder.price * selectedOrder.quantity).toLocaleString()} VNĐ</p>
                            <p><span className="font-semibold">Size:</span> {selectedOrder.size}</p>
                            <p><span className="font-semibold">Topping:</span> {selectedOrder.topping}</p>
                            <p><span className="font-semibold">Ghi chú:</span> {selectedOrder.note}</p>
                            <p><span className="font-semibold">Người xử lý:</span> {selectedOrder.handler}</p>
                            <p><span className="font-semibold">Thời gian:</span> {selectedOrder.time}</p>
                            <p><span className="font-semibold">Trạng thái:</span> {selectedOrder.status === "pending"
                                ? "Đang xử lý"
                                : selectedOrder.status === "completed"
                                    ? "Hoàn thành"
                                    : "Đã hủy"}</p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="px-4 py-2 bg-red-200 text-red-800 rounded-md hover:bg-red-300"
                                onClick={handleModalClose}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
