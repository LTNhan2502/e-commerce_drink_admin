'use client'

import { AiOutlinePlusCircle } from "react-icons/ai";
import Image from "next/image";
import {IoAddCircleOutline} from "react-icons/io5";

const ManageOrders = () => {
    return (
        <div className='px-3 py-2'>
            {/* Thông tin chung */}
            <div className='rounded-md p-3 bg-white shadow-sm'>
                <div className='flex justify-between items-center '>
                    {/* Tiêu đề */}
                    <div>
                        <h3 className='font-bold text-2xl'>Đơn hàng</h3>
                        <h5 className='font-normal'>Quản lí đơn hàng</h5>
                    </div>
                    {/* Button thêm */}
                    <div>
                        <button
                            className="bg-white border border-gray-300 text-indigo-500 hover:bg-indigo-800 hover:text-white rounded-full p-2 shadow transition-all"

                        >
                            <IoAddCircleOutline className="text-2xl"/>
                        </button>
                    </div>
                </div>

                {/* Tìm kiếm */}
                <div className='flex flex-wrap mt-3 gap-3'>
                    <input
                        type="text"
                        className='border rounded-md px-3 py-2 w-full md:w-1/4 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2'
                        placeholder='Tên khách'
                    />
                    <input
                        type="number"
                        className='border rounded-md px-3 py-2 w-full md:w-1/6 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2'
                        placeholder='Số bàn'
                    />
                    <select
                        className='border rounded-md px-3 py-2 w-full md:w-1/4 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all'
                    >
                        <option value="">Trạng thái</option>
                        <option value="pending">Đang chờ</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* Card đơn hàng */}
            <div className='flex justify-between items-center rounded-md p-3 mt-6'>
                <div className="flex flex-col lg:flex-row bg-white shadow-md rounded-md overflow-hidden p-4">
                    {/* Hình ảnh */}
                    <div className="flex-shrink-0 w-full lg:w-1/3 h-40 lg:h-auto relative">
                        <Image
                            src="/path-to-your-image.jpg"
                            alt="Product"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Nội dung */}
                    <div className="flex flex-col flex-1 p-4 space-y-4">
                        {/* Tiêu đề */}
                        <h2 className="text-lg font-bold text-gray-800">
                            Tên khách hàng: <span className="font-normal">Nguyễn Văn A</span>
                        </h2>

                        {/* Thông tin sản phẩm */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p>
                                <span className="font-semibold">Sản phẩm: </span>
                                Trà sữa matcha
                            </p>
                            <p>
                                <span className="font-semibold">Đơn giá: </span>
                                45,000 VNĐ
                            </p>
                            <p>
                                <span className="font-semibold">Số lượng: </span>
                                2
                            </p>
                            <p>
                                <span className="font-semibold">Size: </span>
                                Lớn
                            </p>
                            <p>
                                <span className="font-semibold">Topping: </span>
                                Trân châu đen, Trân châu trắng
                            </p>
                            <p>
                                <span className="font-semibold">Ghi chú: </span>
                                Ít đá, thêm đường
                            </p>
                        </div>

                        {/* Select trạng thái */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <label htmlFor="status" className="font-semibold text-sm">
                                Trạng thái:
                            </label>
                            <select
                                id="status"
                                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            >
                                <option value="pending">Đang xử lý</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>

                        {/* Người xử lí & Thời gian */}
                        <div className="text-sm">
                            <p>
                                <span className="font-semibold">Người xử lí: </span>
                                Admin01
                            </p>
                            <p>
                                <span className="font-semibold">Thời gian: </span>
                                18:30 - 19/12/2024
                            </p>
                        </div>

                        {/* Button */}
                        <div>
                            <button
                                className="mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;
