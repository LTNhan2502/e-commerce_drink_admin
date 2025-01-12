'use client'
import React, {useEffect, useState} from "react";
import OrdersModal from "@/components/orders/orders.modal";
import {IoAddCircleOutline} from "react-icons/io5";
import {changeStatus, deleteOrder, getOrders} from "@/utils/orderServices";
import LoadingOverlay from "@/components/reuse/loading.overlay";
import {toast} from "react-toastify";
import DeleteModal from "@/components/reuse/delete.modal";
import AddOrderModal from "@/components/orders/add.order.modal";
import {RiCheckFill, RiCloseFill} from "react-icons/ri";

const ManageOrders = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
    const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [changeID, setChangeID] = useState<string>('');
    const [changeValue, setChangeValue] = useState<string>('');
    const statusList = ['waiting', 'ordered', 'paid'];

    const [selectedDeleteOrder, setSelectedDeleteOrder] = useState<{ name: string, id: string }>({ name: '', id: '' });
    const [deleteOrderID, setDeleteOrderID] = useState<string>('');

    const [nameSearch, setNameSearch] = useState<string>('');
    const [statusSearch, setStatusSearch] = useState<string>('');
    const searchedOrders = orders
        // Filter theo tên
        .filter((item) => item.name.toLowerCase().includes(nameSearch.toLowerCase()))
        // Filter theo status
        .filter((item) => {
            // Trạng thái mặc định hiển thị all
            if(statusSearch === '') return true;
            // Trạng thái hiển thị theo searchStatus
            return item.status === statusSearch
        })

    // Hàm clear filter
    const handleClearFilter = () => {
        setNameSearch('')
        setStatusSearch('')
    }

    // Hàm mở modal detail
    const handleViewDetail = (order: IOrder) => {
        setIsOpenDetail(true);
        setSelectedOrder(order)
    }

    // Hàm thay đổi status
    const handleClickChangeStatus = (id: string, currentStatus: string) => {
        setChangeID(id);

        // Tìm chỉ mục của trạng thái hiện tại
        const currentIndex = statusList.indexOf(currentStatus);

        // Chuyển sang trạng thái tiếp theo (vòng lặp)
        const nextStatus = statusList[(currentIndex + 1) % statusList.length];
        setChangeValue(nextStatus);
    };

    // Hàm huỷ thay đổi status
    const handleCancelChange = () => {
        setChangeID('')
        setChangeValue('')
    }

    // Hàm xác nhận thay đổi status
    const handleSaveStatus = async () => {
        setLoading(true)
        try {
            const data = { _id: changeID, status: changeValue }
            const res = await changeStatus(data)

            setOrders((prev) =>
                prev.map((item) =>
                    item._id === changeID
                        ? {...item, status: res.data.status}
                        : item
                )
            )

            toast.success("Thay đổi thành công")
        }catch(error){
            console.log("Failed to change status", error)
            toast.error('Lưu thất bại')
        }finally {
            setChangeID('')
            setChangeValue('')
            setLoading(false)
        }
    }


    // Hàm click xoá order
    const handleClickDelete = (order: IOrder) => {
        setIsOpenDeleteModal(true)
        setSelectedDeleteOrder({name: order.name, id: order._id})
        setDeleteOrderID(order._id)
    }

    // Hàm xác nhận xoá order
    const handleDeleteOrder = async (id: string) => {
        setLoading(true);
        try {
            const res = await deleteOrder(id);

            if(res){
                setOrders((prev) => prev.filter(item => item._id !== id))
                toast.success("Xoá thành công")
            }
        }catch(error){
            console.log("Failed to delete order", error)
            toast.error("Xoá thất bại")
        }finally {
            setLoading(false);
            setIsOpenDeleteModal(false)
        }
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

    // Kiểm tra orders
    useEffect(() => {
        console.log(">>Check order (order.card.tsx(64))", orders)
    }, [orders]);

    return (
        <>
            {loading && <LoadingOverlay/>}
            {/* Modal chi tiết */}
            <OrdersModal show={isOpenDetail} handleClose={() => setIsOpenDetail(false)} selectedOrder={selectedOrder}/>
            {/* Modal thêm */}
            <AddOrderModal setOrders={setOrders} show={isOpenAdd} handleClose={() => setIsOpenAdd(false)}/>
            {/* Modal xoá */}
            <DeleteModal show={isOpenDeleteModal} handleClose={() => setIsOpenDeleteModal(false)} selectedObject={selectedDeleteOrder} selectType="order" onConfirm={() => handleDeleteOrder(deleteOrderID)}/>

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
                                onClick={() => setIsOpenAdd(true)}
                            >
                                <IoAddCircleOutline className="text-2xl"/>
                            </button>
                        </div>
                    </div>

                    {/* Tìm kiếm */}
                    <div className="mt-6">
                        <div className='flex items-center justify-between'>
                            <p className='font-medium mb-4 text-xl'>Bộ lọc</p>
                            {nameSearch.trim().length > 0 || statusSearch ? (
                                <button
                                    onClick={handleClearFilter}
                                    className='mb-3 px-2 py-1 font-medium rounded-md bg-indigo-100 text-indigo-800 hover:shadow-md hover:shadow-indigo-400 transition-all'
                                >
                                    Xoá lọc
                                </button>
                            ) : ''}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Input Tên khách */}
                            <label className="relative">
                                <input
                                    type="text"
                                    value={nameSearch}
                                    required
                                    onChange={(e) => setNameSearch(e.target.value)}
                                    className="border rounded-md w-full px-3 py-2 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                                />
                                <span
                                    className="absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
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
                                <span
                                    className="absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                    Số bàn
                                </span>
                            </label>

                            {/* Select Trạng thái */}
                            <select
                                value={statusSearch}
                                onChange={(e) => setStatusSearch(e.target.value)}
                                className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all"
                            >
                                <option value="">Trạng thái</option>
                                <option value="waiting">Đang chờ</option>
                                <option value="ordered">Đã phục vụ</option>
                                <option value="paid">Đã thanh toán</option>
                            </select>

                            {/* Nội dung trống để giữ layout */}
                            <div></div>
                        </div>
                    </div>

                </div>

                {/* Danh sách đơn hàng */}
                {orders.length === 0 ? (
                    <div className='text-center py-6 font-bold text-md'>
                        Không có dữ liệu đơn hàng
                    </div>
                ) : (

                    searchedOrders.length === 0 ? (
                        <div className='text-center py-6 font-bold text-md'>
                            Đơn hàng bạn tìm kiếm không tồn tại
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                            {searchedOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="relative flex items-center bg-white shadow-md rounded-md overflow-hidden border border-gray-200 p-[10px]"
                                >
                                    {/* Nút X để xoá */}
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
                                        onClick={() => handleClickDelete(order)}
                                    >
                                        ✖
                                    </button>

                                    {/* Nội dung */}
                                    <div className="flex flex-col flex-1">
                                        <h2 className="text-md font-semibold text-gray-800">{order.name}</h2>
                                        <div className="flex justify-between items-center text-sm">
                                            <p>
                                                <span className="font-sm text-xs text-gray-500">Tổng: </span>
                                                {order.order_details
                                                    ?.reduce((total, item) => {
                                                        // Tổng giá sản phẩm chính
                                                        const itemTotal = (item.price || 0) * (item.quantity || 0);

                                                        // Tổng giá của topping
                                                        const toppingTotal = item.topping?.reduce((toppingSum, topping) => {
                                                            return toppingSum + (topping.price || 0);
                                                        }, 0) || 0;

                                                        // Cộng tổng giá sản phẩm và topping (topping cũng nhân với số lượng sản phẩm)
                                                        return total + itemTotal + toppingTotal;
                                                    }, 0)
                                                    ?.toLocaleString() || 0} VNĐ
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
                                            <div>
                                                {changeID === order._id ? (
                                                    <div className='flex justify-around'>
                                                    <span
                                                        onClick={() => handleClickChangeStatus(order._id, changeValue || order.status)}
                                                        className={`flex items-center justify-center cursor-pointer text-xs text-white font-medium rounded-md px-2 py-1 transition-colors ${changeValue === 'waiting' ? 'bg-indigo-800' : changeValue === 'ordered' ? 'bg-yellow-500' : 'bg-emerald-600'}`}
                                                    >
                                                        {changeValue}
                                                    </span>
                                                        <button
                                                            onClick={handleCancelChange}
                                                            className='rounded-md px-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100 mx-1'
                                                        >
                                                            <RiCloseFill/>
                                                        </button>
                                                        <button
                                                            onClick={handleSaveStatus}
                                                            className='ml-2 rounded-md px-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100'
                                                        >
                                                            <RiCheckFill/>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        onClick={() => handleClickChangeStatus(order._id, order.status)}
                                                        className={`flex items-center justify-center cursor-pointer text-xs text-white font-medium rounded-md px-2 py-1 transition-colors ${order.status === 'waiting' ? 'bg-indigo-800' : order.status === 'ordered' ? 'bg-yellow-500' : 'bg-emerald-600'}`}
                                                    >
                                                    {order.status}
                                                </span>
                                                )}
                                            </div>

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
                    )
                )}
            </div>
        </>
    );
};

export default ManageOrders;
