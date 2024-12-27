'use client'
import Image from "next/image";
import React, { useState } from "react";
import OrdersModal from "@/components/orders/orders.modal";
import {IoAddCircleOutline} from "react-icons/io5";

export

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
        status: "Đang chờ",
    });

    return (
        <div className="px-5 py-4">
            {/* Thông tin chung */}
            <div className="rounded-md px-6 py-5 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-2xl">Đơn hàng</h3>
                        <h5 className="font-normal">Quản lí đơn hàng</h5>
                    </div>
                    <div>
                        <button
                            className="bg-white border border-gray-300 text-indigo-500 hover:bg-indigo-800 hover:text-white rounded-full p-2 shadow transition-all"

                        >
                            <IoAddCircleOutline className="text-2xl"/>
                        </button>
                    </div>
                </div>

                {/* Tìm kiếm */}
                <div className='mt-6'>
                    <p className='font-medium mb-2 text-xl'>Bộ lọc</p>
                    <div className="flex flex-wrap gap-3">
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
                        <select
                            className="border rounded-md px-3 py-2 w-full md:w-1/4 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all">
                            <option value="">Trạng thái</option>
                            <option value="pending">Đang chờ</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
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
                                    <span className="flex items-center justify-center text-sm text-white rounded-full px-3 py-1 font-semibold bg-indigo-800">{order.status}</span>

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
