'use client'
import {QRCode} from "qrcode";
import React, {useState} from "react";
import {IoAddCircleOutline} from "react-icons/io5";
import {LiaEditSolid} from "react-icons/lia";
import {RiDeleteBin6Line} from "react-icons/ri";
import LoadingOverlay from "@/components/reuse/loading.overlay";
import Link from "next/link";
import QrcodeTable from "@/components/table/qrcode.table";

interface ITable {
    _id: string;
    tableNumber: number;
    quantity: number;
    QRCode: string;
    status: string;
    lastGen: string | null;
}

const ManageTable = () => {
    const table_number = [
        {
            _id: "t1",
            tableNumber: 1,
            quantity: 3,
            QRCode: '',
            status: 'inactive',
            lastGen: null
        },
        {
            _id: "t2",
            tableNumber: 2,
            quantity: 4,
            QRCode: '',
            status: 'inactive',
            lastGen: null
        },
        {
            _id: "t3",
            tableNumber: 3,
            quantity: 5,
            QRCode: '',
            status: 'inactive',
            lastGen: null
        }
    ];


    const [tables, setTables] = useState<ITable[]>(table_number);
    const [loading, setLoading] = useState(false);

    // Hàm tạo QRCode
    const generateQRCode = async (tableID: string) => {
        const token = `${tableID}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
        const qrUrl = `https://e-commerce-drink-client.vercel.app/table/${token}`

        setTables(tables.map((table: ITable) =>
            table._id === tableID
                ? {
                    ...table,
                    QRCode: qrUrl,
                    status: 'active',
                    lastGen: new Date().toISOString(),
                } : table
        ))
    }
    return (

        <div className="px-5 py-4">
            {loading && <LoadingOverlay/>}

            {/* Thông tin chung */}
            <div className="rounded-md px-6 py-5 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-2xl">Bàn</h3>
                        <h5 className="font-normal">Quản lí bàn</h5>
                    </div>
                    <div>
                        <button
                            className="bg-white border border-gray-300 text-indigo-500 hover:bg-indigo-800 hover:text-white rounded-full p-2 shadow transition-all"
                            // onClick={() => setIsOpenAddModal(true)}
                        >
                            <IoAddCircleOutline className="text-2xl"/>
                        </button>
                    </div>
                </div>

                {/* Tìm kiếm */}
                <div className='mt-6'>
                    <p className='font-medium mb-4 text-xl'>Bộ lọc</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Input Tên sản phẩm */}
                        <label className="relative">
                            <input
                                type="text"
                                required
                                className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
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
                            <option value="pending">Còn trống</option>
                            <option value="completed">Đầy</option>
                        </select>

                        {/* Nội dung trống để giữ layoutt */}
                        <div></div>
                        <div></div>
                    </div>

                </div>
            </div>

            <div className="relative border rounded-lg bg-white shadow-md mt-12">
                <div
                    className='flex justify-start items-center relative -mt-6 z-[10] bg-indigo-100 mx-4 rounded-md px-3 py-4 shadow-md shadow-indigo-200'
                >
                    <h3 className='font-bold text-2xl text-indigo-800'>Bảng Table</h3>
                </div>
                <table className="w-full bg-white text-left text-sm text-gray-800 rounded-md mt-7 table-auto">
                    <thead className="border-b border-gray-300">
                    <tr className="w-full border-b text-left text-xs font-medium text-gray-500 uppercase">
                        <th className="px-6 py-4">Số bàn</th>
                        <th className="px-6 py-4">Sức chứa</th>
                        <th className="px-6 py-4 text-center">QR Code</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {tables.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-6 font-bold text-md">
                                Không có dữ liệu sản phẩm
                            </td>
                        </tr>
                    ) : (
                        tables.map((table, index) => (
                            <tr key={index} className="border-b">
                                {/* Số bàn */}
                                <td className=" px-6 py-4">
                                    <div className="ml-3">
                                        <div className="font-medium text-gray-800">{table.tableNumber}</div>
                                    </div>
                                </td>

                                {/* Sức chứa */}
                                <td className="px-6 py-4">
                                    <div>{table.quantity}</div>
                                </td>

                                {/* QR Code */}
                                <td className="flex items-center justify-center px-6 py-4">
                                    {table.QRCode ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <QrcodeTable token={table.QRCode} tableNumber={table.tableNumber}/>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => generateQRCode(table._id)}
                                                    className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-800 rounded hover:shadow-md hover:shadow-indigo-400 transition-all"
                                                >
                                                    Tạo mới
                                                </button>
                                                <button
                                                    onClick={() => window.print()}
                                                    className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded hover:shadow-md hover:shadow-green-400 transition-all"
                                                >
                                                    In
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => generateQRCode(table._id)}
                                            className="px-4 py-2 font-medium bg-indigo-100 text-indigo-800 rounded hover:shadow-md hover:shadow-indigo-400 transition-all"
                                        >
                                            Tạo QR
                                        </button>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className='flex justify-end items-center gap-2'>
                                        <Link
                                            className="rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100"
                                            href={`/table/${table._id}`}
                                        >
                                            <LiaEditSolid className="text-2xl"/>
                                        </Link>
                                        <button
                                            className="ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100"
                                            // onClick={() => handleOpenDeleteModal({ name: table.name, _id: table._id })}
                                        >
                                            <RiDeleteBin6Line className="text-2xl"/>
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageTable;
