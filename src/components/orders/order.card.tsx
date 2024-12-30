'use client'
import Image from "next/image";
import React, {useEffect, useState} from "react";
import OrdersModal from "@/components/orders/orders.modal";
import {IoAddCircleOutline} from "react-icons/io5";
import {getOrders} from "@/utils/orderServices";
import LoadingOverlay from "@/components/reuse/loading.overlay";

export

const ManageOrders = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Hàm mở modal
    const handleViewDetail = (order: IOrder) => {
        setIsOpen(true);
        setSelectedOrder(order)
    }

    const handleDeleteOrder = (id: string) => {
        setOrders((prev) => prev.filter(item => item._id !== id))
    }

    // Fetch all orders
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await getOrders();
                setOrders(res.data.result);
            }catch (error){
                console.log("Failed to fetch orders", error)
            }finally {
                setLoading(false);
            }
        }

        fetchOrders()
    }, []);

    return (
        <>
            {loading && <LoadingOverlay/>}
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
                    <div className="mt-6">
                        <p className="font-medium mb-4 text-xl">Bộ lọc</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Input Tên khách */}
                            <label className="relative">
                                <input
                                    type="text"
                                    required
                                    className="border rounded-md w-full px-3 py-2 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                                />
                                <span className="absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                    Tên khách
                                </span>
                            </label>

                            {/* Input Số bàn */}
                            <label className="relative">
                                <input
                                    type="number"
                                    required
                                    className="border rounded-md w-full px-3 py-2 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                                />
                                <span className="absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                    Số bàn
                                </span>
                            </label>

                            {/* Select Trạng thái */}
                            <select
                                className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all"
                            >
                                <option value="">Trạng thái</option>
                                <option value="pending">Đang chờ</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>

                            {/* Nội dung trống để giữ layout */}
                            <div></div>
                        </div>
                    </div>

                </div>

                {/* Danh sách đơn hàng */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="relative flex items-center bg-white shadow-md rounded-md overflow-hidden border border-gray-200 p-[10px]"
                        >
                            {/* Nút X để đóng */}
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
                                onClick={() => handleDeleteOrder(order._id)}
                            >
                                ✖
                            </button>

                            {/* Hình ảnh bên trái */}
                            <div className="relative w-16 h-16 mr-4">
                                <Image
                                    src={'https://ui-avatars.com/api/?backgound=c7d2fe&color=3730a3&bold=true'}
                                    alt="Product"
                                    className="object-cover h-full w-full rounded-md"
                                    width={150}
                                    height={150}
                                />
                                {order.order_details.length > 1 && (
                                    <span className="absolute top-0 right-0 flex justify-center items-center bg-black/50 text-xl text-white font-semibold rounded-md w-full h-full">
                                        +{order.order_details.length - 1}
                                    </span>
                                )}
                            </div>

                            {/* Nội dung bên phải */}
                            <div className="flex flex-col flex-1">
                                <h2 className="text-md font-semibold text-gray-800">{order.name}</h2>
                                <div className="flex justify-between items-center text-sm">
                                    <p>
                                        <span className="font-sm text-xs text-gray-500">Tổng: </span>
                                        {order.order_details
                                            .reduce((total, item) => total + item.price * item.quantity, 0)
                                            .toLocaleString()} VNĐ
                                    </p>
                                </div>
                                <div>
                                    <span className="font-sm text-xs text-gray-500">Thời gian: </span>
                                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false, // Sử dụng định dạng 24 giờ
                                    })}
                                </div>

                                {/* Trạng thái */}
                                <div className='flex justify-between items-center'>
                                    <span
                                        className="flex items-center justify-center text-xs text-white font-medium rounded-md px-2 bg-indigo-800">
                                        {order.status}
                                    </span>
                                    <button
                                        className="mt-2 text-indigo-600 text-xs font-medium hover:text-indigo-800 transition"
                                        onClick={() => handleViewDetail(order)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Modal chi tiết */}
                <OrdersModal show={isOpen} handleClose={() => setIsOpen(false)} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder}/>
            </div>
        </>
    );
};

export default ManageOrders;
