'use client'
import React, {useState} from "react";
import {IoAddCircleOutline} from "react-icons/io5";
import {LiaEditSolid} from "react-icons/lia";
import {RiCheckFill, RiCloseFill, RiDeleteBin6Line} from "react-icons/ri";
import LoadingOverlay from "@/components/reuse/loading.overlay";
import QrcodeTable from "@/components/table/qrcode.table";
import DeleteModal from "@/components/reuse/delete.modal";
import {toast} from "react-toastify";
import AddTableModal from "@/components/table/add.table.modal";

interface ISelectedTable {
    _id: string;
    name: string;
    quantity?: number;
}

const ManageTable = () => {
    const table_number = [
        {
            _id: "t1",
            tableNumber: "1",
            quantity: 3,
            QRCode: '',
            status: 'inactive',
            lastGen: null
        },
        {
            _id: "t2",
            tableNumber: "2",
            quantity: 4,
            QRCode: '',
            status: 'inactive',
            lastGen: null
        },
        {
            _id: "t3",
            tableNumber: "3",
            quantity: 5,
            QRCode: '',
            status: 'inactive',
            lastGen: null
        }
    ];


    const [tables, setTables] = useState<ITable[]>(table_number);
    const [selectedTable, setSelectedTable] = useState<ISelectedTable | null>(null);
    const [showAddModal, setShowAddModal] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const [editingID, setEditingID] = useState<string>('');
    const [editValue, setEditValue] = useState<number>(0);

    const [tableNumberSearch, setTableNumberSearch] = useState<string>('');
    const [quantitySearch, setQuantitySearch] = useState<number>(0);
    const searchedTables = tables
        // Filter theo số bàn
        .filter((item) => item.tableNumber.toLowerCase().includes(tableNumberSearch.toLowerCase()))
        // Filter theo sức chứa
        .filter((item) => {
            // Mặc định hiển thị all
            if(quantitySearch === 0) return true;
            // Hiển thị sức chứa theo tìm kiếm
            return item.quantity === quantitySearch
        })

    // Hàm clear filter
    const handleClearFilter = () => {
        setTableNumberSearch('')
        setQuantitySearch(0)
    }

    // Hàm click chỉnh sửa
    const handleClickChange = (id: string, value: number) => {
        setEditingID(id)
        setEditValue(value)
    }

    // Hàm lưu chỉnh sửa
    const handleSaveChange = () => {
        setLoading(true)
        try {
            //  Call api thay đổi
        }catch(error){
            console.log("Failed to save table", error)
            toast.error("Lưu thất bại")
        }finally {
            setLoading(false)
        }
    }

    // Hàm huỷ chỉnh sửa
    const handleCancelChange = () => {
        setEditingID('')
        setEditValue(0)
    }

    // Hàm mở delete modal
    const handleOpenDeleteModal = (data: ISelectedTable) => {
        setShowDeleteModal(true)
        setSelectedTable(data);
    }

    // Hàm xác nhận xoá
    const handleDeleteTable = () => {
        setLoading(true)
        try {
            // Call api

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
    const generateQRCode = async (tableID: string, tableNumber: string) => {
        // Call api lấy token mới về


        // const fakeToken = `${tableID}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
        const qrUrl = `https://e-commerce-drink-client.vercel.app/table/${tableNumber}`

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
                            {tableNumberSearch.trim().length > 0 || quantitySearch !== 0 ? (
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

                            {/* Sức chứa */}
                            <label className="relative">
                                <input
                                    type="number"
                                    value={quantitySearch}
                                    required
                                    onChange={(e) => setQuantitySearch(parseInt(e.target.value) || 0)}
                                    className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                                />
                                <span
                                    className="absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                    Sức chứa
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
                            searchedTables.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 font-bold text-md">
                                        Bàn bạn tìm kiếm không tồn tại
                                    </td>
                                </tr>
                            ) : (
                                searchedTables.map((table, index) => (
                                    <tr key={index} className="border-b">
                                        {table._id === editingID ? (
                                            <>
                                                {/* Số bàn */}
                                                <td className=" px-6 py-4">
                                                    <div className="ml-3">
                                                        <div className="font-medium text-gray-800">{table.tableNumber}</div>
                                                    </div>
                                                </td>

                                                {/* Sức chứa */}
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(parseInt(e.target.value))}
                                                            autoFocus
                                                            className='px-2 py-1 border rounded-md hover:border-gray-400 focus:outline-none focus:shadow-md focus:shadow-indigo-400 transition-all'
                                                        />
                                                    </div>
                                                </td>

                                                {/* QR Code */}
                                                <td className="flex items-center justify-center px-6 py-4">
                                                    {table.QRCode ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <QrcodeTable token={table.QRCode} tableNumber={table.tableNumber}/>
                                                            <div className="flex gap-2">
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
                                                            onClick={() => generateQRCode(table._id!, table.tableNumber)}
                                                            className="px-4 py-2 font-medium bg-indigo-100 text-indigo-800 rounded hover:shadow-md hover:shadow-indigo-400 transition-all"
                                                        >
                                                            Tạo QR
                                                        </button>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className='flex justify-end items-center gap-2'>
                                                        <button
                                                            onClick={handleCancelChange}
                                                            className='rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100'
                                                        >
                                                            <RiCloseFill className='text-2xl'/>
                                                        </button>
                                                        <button
                                                            // onClick={handleSaveSizeChange}
                                                            className='ml-2 rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100'
                                                        >
                                                            <RiCheckFill className='text-2xl'/>
                                                        </button>

                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
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
                                                            onClick={() => generateQRCode(table._id!, table.tableNumber)}
                                                            className="px-4 py-2 font-medium bg-indigo-100 text-indigo-800 rounded hover:shadow-md hover:shadow-indigo-400 transition-all"
                                                        >
                                                            Tạo QR
                                                        </button>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className='flex justify-end items-center gap-2'>
                                                        <button
                                                            className="rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100"
                                                            onClick={() => handleClickChange(table._id!, table.quantity)}
                                                        >
                                                            <LiaEditSolid className="text-2xl"/>
                                                        </button>
                                                        <button
                                                            className="ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100"
                                                            onClick={() => handleOpenDeleteModal({ name: table.tableNumber, _id: table._id! })}
                                                        >
                                                            <RiDeleteBin6Line className="text-2xl"/>
                                                        </button>

                                                    </div>
                                                </td>
                                            </>
                                        )}
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
