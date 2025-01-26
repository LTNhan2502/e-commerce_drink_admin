'use client'
import React, {useEffect, useState} from "react";
import {deleteMenu, getMenu} from "@/utils/menuServices";
import {getCategory} from "@/utils/categoryServices";
import {IoAddCircleOutline} from "react-icons/io5";
import Image from "next/image";
import {LiaEditSolid} from "react-icons/lia";
import {RiDeleteBin6Line} from "react-icons/ri";
import ToggleButton from "@/components/reuse/toggle.button";
import LoadingOverlay from "@/components/reuse/loading.overlay";
import {getFile} from "@/utils/fileServices";
import Link from "next/link";
import AddMenuModal from "@/components/menu/add.menu.modal";
import {toast} from "react-toastify";
import DeleteModal from "@/components/reuse/delete.modal";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";

const MenuTable = () => {
    const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [menu, setMenu] = useState<IProduct[]>([])
    const [selectedMenu, setSelectedMenu] = useState<{ name: string; _id: string } | null>(null);
    const [category, setCategory] = useState<ICategory[]>([]);
    const [imageURLs, setImageURLs] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false);

    const [nameSearch, setNameSearch] = useState<string>("");
    const [stockSearch, setStockSearch] = useState<string>("");
    const searchedMenu = menu
        // Filter theo tên
        .filter((item) => item.name.toLowerCase().includes(nameSearch.toLowerCase()))
        // Filter theo stock
        .filter((item) => {
            // Stock ở trạng thái mặc định sẽ hiển thị all
            if(stockSearch === '') return true;
            // Nếu stockSearch là true, thì return true, ngược lại
            return item.isOutOfStock === ( stockSearch === 'true' )
        })

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const pageSize = 10

    // Hàm clear filter
    const handleClearFilter = () => {
        setNameSearch('')
        setStockSearch('')
    }

    // Hàm mở modal xoá
    const handleOpenDeleteModal = (menu: {name: string; _id: string}) => {
        setSelectedMenu(menu)
        setIsOpenDeleteModal(true)
    }

    // Hàm đóng modal xoá
    const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false)
        setSelectedMenu(null)
    }

    // Hàm xác nhận xoá
    const handleDeleteMenu = async (id: string) => {
        setLoading(true);
        try {
            const res = await deleteMenu(id)

            if(res){
                setMenu((prev) => prev.filter(item => item._id !== id))
                toast.success("Xoá thành công")
            }
        }catch(error){
            console.log("Failed to delete", error)
        }finally {
            setIsOpenDeleteModal(false)
            setLoading(false)
        }
    }

    // Hàm fetch menu
    const fetchMenu = async (currentPage: number) => {
        setLoading(true)
        try {
            const [menuRes, categoryRes] = await Promise.all([
                getMenu(currentPage, pageSize),
                getCategory()
            ])

            setMenu(menuRes.data.result)
            setTotalPages(menuRes.data.meta.sumPage)
            setCategory(categoryRes.data)
        }catch(error){
            console.log("Failed to fetch menu data", error)
            toast.error("Lỗi lấy dữ liệu menu")
        }finally {
            setLoading(false)
        }
    }

    // Hàm chuyển trang
    const handleChangePage = (page: number ) => {
        if(page === currentPage) return;

        setCurrentPage(page)
        window.scroll({ top: 0, behavior: "smooth" })
    }

    // Fetch data menu, category
    useEffect(() => {
        fetchMenu(currentPage)
    }, [currentPage]);

    // Fetch image url
    useEffect(() => {
        if (!menu) return;

        const fetchImageURLs = async () => {
            setLoading(true)
            try {
                const reqs = menu.map(async (menu) => {
                    if (menu.images && menu.images[0]) {
                        const res = await getFile(menu.images[0]);
                        return { id: menu.images[0], url: res.data.data.url };
                    }
                    return null;
                });

                const results = await Promise.all(reqs);
                const urls = results.reduce<Record<string, string>>((acc, curr) => {
                    if (curr) acc[curr.id] = curr.url;
                    return acc;
                }, {});

                setImageURLs(urls);
            } catch (error) {
                console.log("Failed to fetch image url", error);
            } finally {
                setLoading(false)
            }
        };

        fetchImageURLs();
    }, [menu]);

    return (

        <div className="px-5 py-4">
            {loading && <LoadingOverlay/>}
            <AddMenuModal
                show={isOpenAddModal}
                handleClose={() => setIsOpenAddModal(false)}
                category={category}
                setOriginMenu={setMenu}
            />
            <DeleteModal
                show={isOpenDeleteModal}
                handleClose={handleCloseDeleteModal}
                selectedObject={selectedMenu}
                selectType="menu"
                onConfirm={() => {
                    if(selectedMenu) handleDeleteMenu(selectedMenu._id)
                }}
            />

            {/* Thông tin chung */}
            <div className="rounded-md px-6 py-5 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-2xl">Sản phẩm</h3>
                        <h5 className="font-normal">Quản lí sản phẩm</h5>
                    </div>
                    <div>
                        <button
                            className="bg-white border border-gray-300 text-indigo-500 hover:bg-indigo-800 hover:text-white rounded-full p-2 shadow transition-all"
                            onClick={() => setIsOpenAddModal(true)}
                        >
                            <IoAddCircleOutline className="text-2xl"/>
                        </button>
                    </div>
                </div>

                {/* Tìm kiếm */}
                <div className='mt-6'>
                    <div className='flex items-center justify-between'>
                        <p className='font-medium mb-4 text-xl'>Bộ lọc</p>
                        {nameSearch.trim().length > 0 || stockSearch ? (
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
                                value={nameSearch}
                                required
                                onChange={(e) => setNameSearch(e.target.value)}
                                className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all peer"
                            />
                            <span
                                className="absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75">
                                Tên sản phẩm
                            </span>
                        </label>

                        {/* Select Trạng thái */}
                        <select
                            value={stockSearch}
                            onChange={(e) => setStockSearch(e.target.value)}
                            className="border rounded-md px-3 py-2 w-full hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:shadow-md focus:shadow-indigo-400 transition-all"
                        >
                            <option value="">Trạng thái</option>
                            <option value="false">Còn hàng</option>
                            <option value="true">Hết hàng</option>
                        </select>

                        {/* Nội dung trống để giữ layoutt */}
                        <div></div>
                        <div></div>
                    </div>

                </div>
            </div>

            {/* Menu */}
            <div className="relative border rounded-lg bg-white shadow-md mt-12">
                <div
                    className='flex justify-start items-center relative -mt-6 z-[10] bg-indigo-100 mx-4 rounded-md px-3 py-4 shadow-md shadow-indigo-200'
                >
                    <h3 className='font-bold text-2xl text-indigo-800'>Bảng Menu</h3>
                </div>
                <table className="w-full bg-white text-left text-sm text-gray-800 rounded-md mt-7 table-auto">
                    <thead className="border-b border-gray-300">
                    <tr className="w-full border-b text-left text-xs font-medium text-gray-500 uppercase">
                        <th className="px-6 py-4">Sản phẩm</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Tồn kho</th>
                        <th className="px-6 py-4">Best seller</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {menu.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-6 font-bold text-md">
                                Không có dữ liệu sản phẩm
                            </td>
                        </tr>
                    ) : (
                    searchedMenu.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-6 font-bold text-md">
                                Sản phẩm bạn tìm kiếm không tồn tại
                            </td>
                        </tr>
                    ) : (
                        searchedMenu.map((menu, index) => (
                            <tr key={index} className="border-b">
                                {/* Tên, giá, ảnh */}
                                <td className="flex items-center px-6 py-4">
                                    <Image
                                        src={imageURLs[menu.images[0]]}
                                        alt={menu.name}
                                        className="h-10 w-10 rounded-md object-cover"
                                        width={150}
                                        height={150}
                                    />
                                    <div className="ml-3">
                                        <div className="font-medium text-gray-800">{menu.name}</div>
                                        <div className="text-gray-500">{menu?.size[0]?.price}</div>
                                    </div>
                                </td>

                                {/* Category */}
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-800">
                                        {category.map(category =>(
                                            category._id.includes(menu.category_id) ? (
                                                <span
                                                    className='text-sm text-gray-500'
                                                    key={category._id}
                                                >
                                                    {category.name}
                                                </span>
                                            ) : ("")
                                        ))}
                                    </div>
                                </td>

                                {/* Tồn kho */}
                                <td className="px-6 py-4 ">
                                    {/*<ToggleButton enabled={enabled} setEnabled={setEnabled}/>*/}
                                    <ToggleButton enabled={!menu.isOutOfStock}/>
                                </td>

                                {/* Best seller */}
                                <td className="px-6 py-4 ">
                                    {/*<ToggleButton enabled={enabled} setEnabled={setEnabled}/>*/}
                                    <ToggleButton enabled={menu.isBestSeller}/>
                                </td>
                                <td className="px-6 py-4 text-blue-500 hover:text-blue-700 cursor-pointer flex justify-end">
                                    <Link
                                        className="rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100"
                                        href={`/menu/${menu._id}`}
                                    >
                                        <LiaEditSolid className="text-2xl"/>
                                    </Link>
                                    <button
                                        className="ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100"
                                        onClick={() => handleOpenDeleteModal({ name: menu.name, _id: menu._id })}
                                    >
                                        <RiDeleteBin6Line className="text-2xl"/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-center gap-2 mt-6'>
                {/* Nút lùi trang */}
                <button
                    onClick={() => handleChangePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 border rounded-md ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
                    }`}
                >
                    <AiOutlineLeft/>
                </button>

                {/* Phần các trang */}
                {/* Dùng spread để tạo ra mảng có giá trị từ pageNumber tới totalPages */}
                {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;

                    // Hiển thị các số trang cụ thể (trang đầu, trang cuối và các trang gần `currentPage` 1 đơn vị)
                    if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => handleChangePage(pageNumber)}
                                className={`px-4 py-2 border rounded-md 
                                    ${currentPage === pageNumber ? 'bg-indigo-100 text-indigo-800' : 'hover:border-gray-400'}
                                `}
                            >
                                {pageNumber}
                            </button>
                        );
                    }

                    // Hiển thị dấu ...
                    if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                        return (
                            <span key={pageNumber} className="px-2">...</span>
                        );
                    }

                    // Không hiển thị các trang không thuộc phạm vi
                    return null;
                })}


                {/* Nút lên trang */}
                <button
                    onClick={() => handleChangePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 border rounded-md ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
                    }`}
                >
                    <AiOutlineRight/>
                </button>
            </div>
        </div>
    );
};

export default MenuTable;
