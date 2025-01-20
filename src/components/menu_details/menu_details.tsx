'use client';
import {deleteSize, getSize, updateSize} from '@/utils/sizeServices';
import {deleteTopping, getTopping, updateTopping} from '@/utils/toppingClient';
import { useEffect, useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { LiaEditSolid } from 'react-icons/lia';
import {RiCheckFill, RiCloseFill, RiDeleteBin6Line} from 'react-icons/ri';
import ModalSize from './modalSize';
import ModalTopping from './modalTopping';
import LoadingOverlay from '@/components/reuse/loading.overlay';
import { toast } from 'react-toastify';
import DeleteModal from '@/components/reuse/delete.modal';
import {deleteCategory, getCategory, updateCategory} from "@/utils/categoryServices";
import ModalCategory from "@/components/menu_details/modalCategory";

export default function MenuDetailsComponent() {
    const [size, setSize] = useState<ISize[]>([]);
    const [topping, setTopping] = useState<ITopping[]>([]);
    const [category, setCategory] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedObject, setSelectedObject] = useState<{ name: string; _id: string } | null>(null);
    const [selectedType, setSelectedType] = useState<'size' | 'topping' | 'category'>('size');
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showToppingModal, setShowToppingModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [editingID, setEditingID] = useState<string>('');
    const [changeValue, setChangeValue] = useState<string>('');
    const [changePrice, setChangePrice] = useState<number>(0);

    // Hàm mở modal size
    const handleOpenSizeModal = (size: ISize) => {
        setSelectedObject({ name: size.size, _id: size._id });
        setSelectedType('size');
        setShowDeleteModal(true);
    };

    // Hàm mở modal topping
    const handleOpenToppingModal = (topping: ITopping) => {
        setSelectedObject(topping);
        setSelectedType('topping');
        setShowDeleteModal(true);
    };

    // Hàm mở modal category
    const handleOpenCategoryModal = (category: ICategory)=> {
        setSelectedObject(category);
        setSelectedType("category")
        setShowDeleteModal(true);
    }

    // Hàm click chỉnh sửa size và category
    const handleClickChange = (id: string, value: string) => {
        setEditingID(id);
        setChangeValue(value);
    }

    // Hàm click chỉnh sửa topping
    const handleClickChangeT = (id: string, value: string, price: number) => {
        setEditingID(id);
        setChangeValue(value);
        setChangePrice(price)
    }

    // Hàm xác nhận thay đổi của size
    const handleSaveSizeChange = async () => {
        if(!editingID || !changeValue){
            toast.info("Giá trị thay đổi không hợp lệ")
            return;
        }

        setLoading(true)
        try {
            const res = await updateSize(editingID, changeValue)

            if(res){
                setSize((prev) =>
                    prev.map((item) =>
                        item._id === editingID ? { ...item, size: changeValue } : item
                    )
                );

                setEditingID('')
                setChangeValue('')
                toast.success("Thay đổi thành công")
            }
        }catch(error){
            console.log("Failed to change", error)
            toast.error("Thay đổi thất bại")
        }finally {
            setLoading(false)
        }
    }

    // Hàm xác nhận thay đổi của topping
    const handleSaveToppingChange = async () => {
        if(!editingID || !changeValue || !changePrice){
            toast.info("Giá trị thay đổi không hợp lệ")
            return;
        }

        setLoading(true)
        try {
            const res = await updateTopping(editingID, changeValue, changePrice)

            if(res){
                setTopping((prev) =>
                    prev.map((item) =>
                        item._id === editingID ? { ...item, name: changeValue, price: changePrice } : item
                    )
                )
                setEditingID('')
                setChangeValue('')
                setChangePrice(0)
                toast.success("Thay đổi thành công")
            }
        }catch(error){
            console.log("Failed to change topping", error)
            toast.error("Thay đổi thất bại")
        }finally {
            setLoading(false)
        }
    }

    // Hàm xác nhận thay đổi của category
    const handleSaveCategoryChange = async () => {
        if(!editingID || !changeValue){
            toast.info("Giá trị thay đổi không hợp lệ")
            return;
        }

        setLoading(true)
        try {
            const res = await updateCategory(editingID, changeValue)

            if(res){
                setCategory((prev) =>
                    prev.map((item) =>
                        item._id === editingID ? { ...item, name: changeValue } : item
                    )
                )
                setEditingID('')
                setChangeValue('')
                toast.success("Thay đổi thành công")
            }
        }catch(error){
            console.log("Failed to change category", error)
            toast.error("Thay đổi thất bại")
        }finally {
            setLoading(false)
        }
    }

    // Hàm huỷ thay đổi
    const handleCancelChange = () => {
        setEditingID('')
        setChangeValue('')
        setChangePrice(0)
    }

    // Hàm xoá size
    const handleDeleteSize = async (id: string) => {
        setLoading(true);
        try {
            const res = await deleteSize(id);

            if (res && res.statusCode === 200) {
                setSize((prev) => prev.filter((item) => item._id !== id));
                toast.success('Xoá thành công');
            }
        } catch (error) {
            console.log('Failed to delete size', error);
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    // Hàm xoá topping
    const handleDeleteTopping = async (id: string) => {
        setLoading(true);
        try {
            const res = await deleteTopping(id);

            if (res && res.statusCode === 200) {
                setTopping((prev) => prev.filter((item) => item._id !== id));
                toast.success('Xoá thành công');
            }
        } catch (error) {
            console.log('Failed to delete topping', error);
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    // Hàm xoá category
    const handleDeleteCategory = async (id: string) => {
        setLoading(true);
        try {
            const res = await deleteCategory(id)

            if(res && res.statusCode === 200) {
                setCategory((prev) => prev.filter(item => item._id !== id));
                toast.success("Xoá thành công")
            }
        }catch(error){
            console.log("Failed to delete category", error)
            toast.error("Xoá thất bại")
        }finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    }

    const handleConfirmDelete = () => {
        if(!selectedObject) return;

        if (selectedObject._id) {
            if (selectedType === 'size') {
                handleDeleteSize(selectedObject._id);
            } else if (selectedType === 'topping') {
                handleDeleteTopping(selectedObject._id);
            }else{
                handleDeleteCategory(selectedObject._id)
            }
        } else {
            console.log('selectedObject or selectedObject._id is undefined');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [sizeRes, toppingRes, categoryRes] = await Promise.all([
                    getSize(),
                    getTopping(),
                    getCategory()
                ]);
                setSize(sizeRes.data);
                setTopping(toppingRes.data);
                setCategory(categoryRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <>
            {loading && <LoadingOverlay />}
            <ModalSize show={showSizeModal} handleClose={() => setShowSizeModal(false)} originSize={size} setOriginSize={setSize} />
            <ModalTopping show={showToppingModal} handleClose={() => setShowToppingModal(false)} originTopping={topping} setOriginTopping={setTopping} />
            <ModalCategory show={showCategoryModal} handleClose={() => setShowCategoryModal(false)} originCategory={category} setOriginCategory={setCategory}/>
            <DeleteModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                selectedObject={selectedObject}
                selectType={selectedType}
                onConfirm={handleConfirmDelete}
            />

            <div className='container mx-auto mt-6 text-end'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                    {/* Size table */}
                    <div className='col-span-1 border border-gray-300 rounded-lg shadow-lg relative mt-6 bg-white'>
                        <div
                            className='flex justify-between items-center relative -mt-6 z-[10] bg-indigo-100 mx-4 rounded-md px-3 py-3 shadow-md shadow-indigo-200'>
                            <h3 className='font-bold text-2xl text-indigo-800'>Bảng Size</h3>
                            <button
                                className='bg-white border border-gray-300 text-indigo-500 hover:bg-indigo-800 hover:text-white rounded-full p-2 shadow transition-all'
                                onClick={() => setShowSizeModal(true)}
                            >
                                <IoAddCircleOutline className='text-2xl'/>
                            </button>
                        </div>
                        <table className='w-full bg-white text-left text-sm text-gray-800 rounded-md mt-6 table-auto'>
                            <thead className='border-b border-gray-300'>
                            <tr>
                                <th className='px-6 py-4 font-medium text-gray-900'>Size</th>
                                <th className='px-6 py-4 font-medium text-gray-900 text-end'></th>
                            </tr>
                            </thead>
                            <tbody>
                            {size.map((item) => (
                                <tr key={item._id} className='border-t-0 border-b last:border-none'>
                                    {item._id === editingID ? (
                                        <>
                                            <td className='px-6 py-4'>
                                                <input
                                                    type="text"
                                                    value={changeValue!}
                                                    onChange={(e) => setChangeValue(e.target.value)}
                                                    autoFocus
                                                    className='px-2 py-1 border rounded-md hover:border-gray-400 focus:outline-none focus:shadow-md focus:shadow-indigo-400 transition-all'
                                                />
                                            </td>
                                            <td className='px-6 py-4 flex justify-end items-center'>
                                                <button
                                                    onClick={handleCancelChange}
                                                    className='rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100'
                                                >
                                                    <RiCloseFill className='text-2xl'/>
                                                </button>
                                                <button
                                                    onClick={handleSaveSizeChange}
                                                    className='ml-2 rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100'
                                                >
                                                    <RiCheckFill className='text-2xl'/>
                                                </button>
                                            </td>
                                        </>

                                    ) : (
                                        <>
                                            <td className='px-6 py-4'>{item.size}</td>
                                            <td className='px-6 py-4 flex justify-end items-center'>
                                                <button
                                                    onClick={() => handleClickChange(item._id, item.size)}
                                                    className='rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100'
                                                >
                                                    <LiaEditSolid className='text-2xl'/>
                                                </button>
                                                <button
                                                    className='ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100'
                                                    onClick={() => handleOpenSizeModal(item)}
                                                >
                                                    <RiDeleteBin6Line className='text-2xl'/>
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Topping table */}
                    <div className='col-span-1 border border-gray-300 rounded-lg shadow-lg relative mt-6 bg-white'>
                        <div
                            className='flex justify-between items-center relative -mt-6 z-[10] bg-indigo-100 mx-4 rounded-md px-3 py-3 shadow-md shadow-indigo-200'>
                            <h3 className='font-bold text-2xl text-indigo-800'>Bảng Topping</h3>
                            <button
                                className='bg-white border border-gray-300 text-indigo-500 hover:bg-indigo-800 hover:text-white rounded-full p-2 shadow transition-all'
                                onClick={() => setShowToppingModal(true)}
                            >
                                <IoAddCircleOutline className='text-2xl'/>
                            </button>
                        </div>
                        <table className='w-full bg-white text-left text-sm text-gray-800 rounded-md mt-6 table-auto'>
                            <thead className='border-b border-gray-300'>
                            <tr>
                                <th className='px-6 py-4 font-medium text-gray-900'>Topping</th>
                                <th className='px-6 py-4 font-medium text-gray-900'>Price</th>
                                <th className='px-6 py-4 font-medium text-gray-900 text-end'></th>
                            </tr>
                            </thead>
                            <tbody>
                            {topping.map((item) => (
                                <tr key={item._id} className='border-b last:border-none'>
                                    {item._id === editingID ? (
                                        <>
                                            <td className='px-6 py-4'>
                                                <input
                                                    type="text"
                                                    value={changeValue}
                                                    onChange={(e) => setChangeValue(e.target.value)}
                                                    autoFocus
                                                    className='w-full px-2 py-1 border rounded-md hover:border-gray-400 focus:outline-none focus:shadow-md focus:shadow-indigo-400 transition-all'
                                                />
                                            </td>
                                            <td className='px-6 py-4'>
                                                <input
                                                    type="number"
                                                    value={changePrice}
                                                    onChange={(e) => setChangePrice(parseInt(e.target.value))}
                                                    autoFocus
                                                    className='w-full px-2 py-1 border rounded-md hover:border-gray-400 focus:outline-none focus:shadow-md focus:shadow-indigo-400 transition-all'
                                                />
                                            </td>
                                            <td className='px-6 py-4 flex justify-end items-center'>
                                                <button
                                                    onClick={handleCancelChange}
                                                    className='rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100'
                                                >
                                                    <RiCloseFill className='text-2xl'/>
                                                </button>
                                                <button
                                                    onClick={handleSaveToppingChange}
                                                    className='ml-2 rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100'
                                                >
                                                    <RiCheckFill className='text-2xl'/>
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className='px-6 py-4'>{item.name}</td>
                                            <td className='px-6 py-4'>{item.price.toLocaleString()}</td>
                                            <td className='px-6 py-4 flex justify-end items-center'>
                                                <button
                                                    onClick={() => handleClickChangeT(item._id, item.name, item.price)}
                                                    className='rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100'
                                                >
                                                    <LiaEditSolid className='text-2xl'/>
                                                </button>
                                                <button
                                                    className='ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100'
                                                    onClick={() => handleOpenToppingModal(item)}
                                                >
                                                    <RiDeleteBin6Line className='text-2xl'/>
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Category */}
                    <div className='col-span-1 border border-gray-300 rounded-lg shadow-lg relative mt-6 bg-white'>
                        <div
                            className='flex justify-between items-center relative -mt-6 z-[10] bg-indigo-100 mx-4 rounded-md px-3 py-3 shadow-md shadow-indigo-200'>
                            <h3 className='font-bold text-2xl text-indigo-800'>Bảng Category</h3>
                            <button
                                className='bg-white border border-gray-300 text-indigo-500 hover:bg-indigo-800 hover:text-white rounded-full p-2 shadow transition-all'
                                onClick={() => setShowCategoryModal(true)}
                            >
                                <IoAddCircleOutline className='text-2xl'/>
                            </button>
                        </div>
                        <table className='w-full bg-white text-left text-sm text-gray-800 rounded-md mt-6 table-auto'>
                            <thead className='border-b border-gray-300'>
                            <tr>
                                <th className='px-6 py-4 font-medium text-gray-900'>Category</th>
                                <th className='px-6 py-4 font-medium text-gray-900 text-end'></th>
                            </tr>
                            </thead>
                            <tbody>
                            {category.map((item) => (
                                <tr key={item._id} className='border-t-0 border-b last:border-none'>
                                    {item._id === editingID ? (
                                        <>
                                            <td className='px-6 py-4'>
                                                <input
                                                    type="text"
                                                    value={changeValue!}
                                                    onChange={(e) => setChangeValue(e.target.value)}
                                                    autoFocus
                                                    className='px-2 py-1 border rounded-md hover:border-gray-400 focus:outline-none focus:shadow-md focus:shadow-indigo-400 transition-all'
                                                />
                                            </td>
                                            <td className='px-6 py-4 flex justify-end items-center'>
                                                <button
                                                    onClick={handleCancelChange}
                                                    className='rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100'
                                                >
                                                    <RiCloseFill className='text-2xl'/>
                                                </button>
                                                <button
                                                    onClick={handleSaveCategoryChange}
                                                    className='ml-2 rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100'
                                                >
                                                    <RiCheckFill className='text-2xl'/>
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className='px-6 py-4'>{item.name}</td>
                                            <td className='px-6 py-4 flex justify-end items-center'>
                                                <button
                                                    onClick={() => handleClickChange(item._id, item.name)}
                                                    className='rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100'
                                                >
                                                    <LiaEditSolid className='text-2xl'/>
                                                </button>
                                                <button
                                                    className='ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100'
                                                    onClick={() => handleOpenCategoryModal(item)}
                                                >
                                                    <RiDeleteBin6Line className='text-2xl'/>
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
