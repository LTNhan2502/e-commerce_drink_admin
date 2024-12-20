'use client'

import { AiOutlinePlusCircle } from "react-icons/ai";
import Image from "next/image";
import { useState } from "react";
import OrdersModal from "@/components/orders/orders.modal";

const ManageOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

    const orders = Array(10).fill({
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

                {/* Tìm kiếm */}
                <div className="flex flex-wrap mt-3 gap-3">
                    <input
                        type="text"
                        className="border rounded-md px-3 py-2 w-full md:w-1/4 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2"
                        placeholder="Tên khách"
                    />
                    <input
                        type="number"
                        className="border rounded-md px-3 py-2 w-full md:w-1/6 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2"
                        placeholder="Số bàn"
                    />
                    <select className="border rounded-md px-3 py-2 w-full md:w-1/4 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all">
                        <option value="">Trạng thái</option>
                        <option value="pending">Đang chờ</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* Danh sách đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {orders.map((order, index) => (
                    <div
                        key={index}
                        className="flex flex-row bg-white shadow-md rounded-md overflow-hidden"
                    >
                        {/* Hình ảnh bên trái */}
                        <div className="w-1/3 h-full relative">
                            <Image
                                src={'https://ui-avatars.com/api/?backgound=c7d2fe&color=3730a3&bold=true'}
                                alt="Product"
                                fill
                                className="object-cover h-full w-full"
                            />
                        </div>

                        {/* Nội dung bên phải */}
                        <div className="flex flex-col flex-1 p-4 space-y-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                Tên khách hàng:{" "}
                                <span className="font-normal">{order.customerName}</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
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
                                    {order.status}
                                </p>
                                <p>
                                    <span className="font-semibold">Thời gian: </span>
                                    {order.time}
                                </p>
                            </div>
                            <button
                                className="mt-4 py-2 px-4 font-semibold w-full bg-indigo-200 text-indigo-800 hover:shadow-md transition-all hover:shadow-indigo-300 rounded-md"
                                onClick={() => setSelectedOrder(order)}
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal chi tiết */}
            <OrdersModal selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
        </div>
    );
};

export default ManageOrders;
