'use client'

import { AiOutlinePlusCircle } from "react-icons/ai";

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
                        <button className='inline-flex items-center bg-indigo-200 text-indigo-800 hover:shadow-md transition-all hover:shadow-indigo-300 rounded-md p-1 text-sm font-medium gap-x-2'>
                            <AiOutlinePlusCircle className='text-base' />
                            Thêm đơn hàng
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
            <div className='flex justify-between items-center rounded-md p-3 mt-6 bg-white shadow-md'>
                <div>
                    <h3 className='font-semibold text-md'>Card đơn hàng</h3>
                    <h5 className='font-light'>Coming soon</h5>
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;
