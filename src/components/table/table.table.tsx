'use client'
import React, {useEffect, useState} from "react";
import {IoAddCircleOutline} from "react-icons/io5";
import {RiDeleteBin6Line} from "react-icons/ri";
import LoadingOverlay from "@/components/reuse/loading.overlay";
import QrcodeTable from "@/components/table/qrcode.table";
import DeleteModal from "@/components/reuse/delete.modal";
import {toast} from "react-toastify";
import AddTableModal from "@/components/table/add.table.modal";
import {deleteTable, getAllTable, updateTable} from "@/utils/tableServices";

interface ISelectedTable {
    _id: string;
    name: string;
    quantity?: number;
}

const ManageTable = () => {
    const [tables, setTables] = useState<ITable[]>([]);
    const [selectedTable, setSelectedTable] = useState<{ name: string, _id: string } | null>(null);
    const [showAddModal, setShowAddModal] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const [tableNumberSearch, setTableNumberSearch] = useState<string>('');
    const searchedTables = tables
        // Filter theo số bàn
        .filter((item) => item.number_table.toLowerCase().includes(tableNumberSearch.toLowerCase()))

    // Hàm clear filter
    const handleClearFilter = () => {
        setTableNumberSearch('')
    }

    // Hàm mở delete modal
    const handleOpenDeleteModal = (data: ISelectedTable) => {
        setShowDeleteModal(true)
        setSelectedTable(data);
    }

    // Hàm xác nhận xoá
    const handleDeleteTable = async () => {
        if(!selectedTable) return;

        setLoading(true)
        try {
            await deleteTable(selectedTable._id)

            setTables((prev) => prev.filter(item => item._id !== selectedTable?._id))
            toast.success("Xoá thành công")
        }catch(error){
            console.log("Failed to delete table",error)
            toast.error("Xoá thất bại")
        }finally {
            setLoading(false)
            setShowDeleteModal(false)
        }
    }

    // Hàm tạo QRCode
    const generateQRCode = async (tableID: string, number_table: string) => {
        setLoading(true)
        const qrUrl = `https://e-commerce-drink-client.vercel.app/table/${number_table}`

        // Nếu không ép thành dạng JSON như bên dưới thì qrUrl sẽ báo lỗi unexpect token
        const data = {
            qr_code: qrUrl
        }

        try {
            await updateTable(tableID, data)

            setTables(tables.map((table: ITable) =>
                table._id === tableID
                    ? {
                        ...table,
                        qr_code: qrUrl,
                    } : table
            ))
            toast.success("Tạo mã QR mới thành công")
        }catch(error){
            console.log('Failed to create QR code', error)
            toast.error("Tạo mã QR thất bại")
        }finally {
            setLoading(false)
        }
    }

    // Fetch table
    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true)
            try {
                const res = await getAllTable()

                setTables(res.data)

            }catch(error){
                console.log("Failed to fetch table", error)
                toast.error("Lỗi nhận table")
            }finally {
                setLoading(false)
            }

        }

        fetchTables()
    }, [])
    return (
        <>
            <AddTableModal show={showAddModal} handleClose={() => setShowAddModal(false)} originTable={tables} setOriginTable={setTables}/>
            <DeleteModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} selectedObject={selectedTable} selectType={'bàn số'} onConfirm={handleDeleteTable}/>
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
                                onClick={() => setShowAddModal(true)}
                            >
                                <IoAddCircleOutline className="text-2xl"/>
                            </button>
                        </div>
                    </div>

                    {/* Tìm kiếm */}
                    <div className='mt-6'>
                        <div className='flex items-center justify-between'>
                            <p className='font-medium mb-4 text-xl'>Bộ lọc</p>
                            {tableNumberSearch.trim().length > 0 ? (
                                <button
                                    onClick={handleClearFilter}
                                    className='mb-3 px-2 py-1 font-medium rounded-md bg-indigo-100 text-indigo-800 hover:shadow-md hover:shadow-indigo-400 transition-all'
                                >
                                    Xoá lọc
                                </button>
                            ) : ''}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Input Tên sản phẩm */}
                            <label className="relative">
                                <input
                                    type="text"
                                    value={tableNumberSearch}
                                    required
                                    onChange={(e) => setTableNumberSearch(e.target.value)}
                                    className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                                />
                                <span
                                    className="absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                    Số bàn
                                </span>
                            </label>

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
                            searchedTables.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 font-bold text-md">
                                        Bàn bạn tìm kiếm không tồn tại
                                    </td>
                                </tr>
                            ) : (
                                searchedTables.map((table, index) => (
                                    <tr key={index} className="border-b">
                                        {/* Số bàn */}
                                        <td className=" px-6 py-4">
                                            <div className="ml-3">
                                                <div className="font-medium text-gray-800">{table.number_table}</div>
                                            </div>
                                        </td>

                                        {/* QR Code */}
                                        <td className="flex items-center justify-center px-6 py-4">
                                            {table.qr_code ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <QrcodeTable token={table.qr_code} tableNumber={table.number_table}/>
                                                    <div className="flex gap-2">
                                                        {/*<button*/}
                                                        {/*    onClick={() => generateQRCode(table._id!)}*/}
                                                        {/*    className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-800 rounded hover:shadow-md hover:shadow-indigo-400 transition-all"*/}
                                                        {/*>*/}
                                                        {/*    Tạo mới*/}
                                                        {/*</button>*/}
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
                                                    onClick={() => generateQRCode(table._id!, table.number_table)}
                                                    className="px-4 py-2 font-medium bg-indigo-100 text-indigo-800 rounded hover:shadow-md hover:shadow-indigo-400 transition-all"
                                                >
                                                    Tạo QR
                                                </button>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className='flex justify-end items-center gap-2'>
                                                <button
                                                    className="ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100"
                                                    onClick={() => handleOpenDeleteModal({ name: table.number_table, _id: table._id! })}
                                                >
                                                    <RiDeleteBin6Line className="text-2xl"/>
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageTable;
