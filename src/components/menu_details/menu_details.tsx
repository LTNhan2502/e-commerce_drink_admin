'use client';
import {deleteSize, getSize} from '@/utils/sizeServices';
import {deleteTopping, getTopping} from '@/utils/toppingClient';
import { useEffect, useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { LiaEditSolid } from 'react-icons/lia';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ModalSize from './modalSize';
import ModalTopping from './modalTopping';
import LoadingOverlay from "@/components/reuse/loading.overlay";
import {toast} from "react-toastify";
import DeleteModal from "@/components/reuse/delete.modal";

export default function MenuDetailsComponent() {
    const [size, setSize] = useState<ISize[]>([]);
    const [topping, setTopping] = useState<ITopping[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedObject, setSelectedObject] = useState<ISize | ITopping | Partial<ISize> | Partial<ITopping>>({})
    const [selectedType, setSelectedType] = useState<'size' | 'topping'>('size');
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showToppingModal, setShowToppingModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleOpenSizeModal = (size: ISize) => {
        setSelectedObject(size)
        setSelectedType('size')
        setShowDeleteModal(true);
    }

    const handleOpenToppingModal = (topping: ITopping) => {
        setSelectedObject(topping)
        setSelectedType('topping')
        setShowDeleteModal(true);
    }

    const handleDeleteSize = async (id: string) => {
        setLoading(true);
        try {
            const res = await deleteSize(id)

            if(res && res.statusCode === 200) {
                setSize(prev => prev.filter((item) => item._id !== id))
                toast.success("Xoá thành công")
            }
        }catch(error){
            console.log("Failed to delete size", error)
        }finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    }

    const handleDeleteTopping = async (id: string) => {
        setLoading(true);
        try {
            const res = await deleteTopping(id)

            if(res && res.statusCode === 200) {
                setTopping(prev => prev.filter((item) => item._id !== id))
                toast.success("Xoá thành công")
            }
        }catch(error){
            console.log("Failed to delete topping", error)
        }finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    }

    const handleConfirmDelete = () => {
        if(selectedObject._id){
            if(selectedType === 'size'){
                handleDeleteSize(selectedObject._id)
            }else if(selectedType === 'topping'){
                handleDeleteTopping(selectedObject._id)
            }
        }else{
            console.log("selectedObject or selectedObject._id is undefined");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [sizeRes, toppingRes] = await Promise.all([getSize(), getTopping()]);
                setSize(sizeRes.data);
                setTopping(toppingRes.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Debug log
    useEffect(() => {
        console.log(">>Check size", size)
        console.log(">>Check topping", topping)
    }, [size, topping]);

    return (
        <>
            {loading && <LoadingOverlay />}
            <ModalSize show={showSizeModal} handleClose={() => setShowSizeModal(false)} setOriginSize={setSize} />
            <ModalTopping show={showToppingModal} handleClose={() => setShowToppingModal(false)} />
            <DeleteModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                selectedObject={selectedObject}
                selectType={selectedType}
                onConfirm={handleConfirmDelete}
            />

            <div className="container mx-auto mt-6 text-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Size table */}
                    <div className="col-span-1 border border-gray-300 rounded-lg shadow-lg relative mt-6 bg-white">
                        <div className='flex justify-between items-center relative -mt-6 z-[10] bg-indigo-100 mx-4 rounded-md px-3 py-3 shadow-md shadow-indigo-200'>
                            <h3 className='font-bold text-2xl text-indigo-800'>Bảng Size</h3>
                            <button
                                className="bg-white border border-gray-300 text-indigo-500 hover:bg-indigo-800 hover:text-white rounded-full p-2 shadow transition-all"
                                onClick={() => setShowSizeModal(true)}
                            >
                                <IoAddCircleOutline className="text-2xl" />
                            </button>
                        </div>
                        <table className="w-full bg-white text-left text-sm text-gray-800 rounded-md mt-6 table-auto">
                            <thead className="border-b border-gray-300">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">Size</th>
                                <th className="px-6 py-4 font-medium text-gray-900 text-end"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {size.map((item) => (
                                <tr key={item._id} className="border-t-0 border-b last:border-none">
                                    <td className="px-6 py-4">{item.size}</td>
                                    <td className="px-6 py-4 flex justify-end items-center">
                                        <button className="rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100">
                                            <LiaEditSolid className="text-2xl" />
                                        </button>
                                        <button
                                            className="ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100"
                                            onClick={() => handleOpenSizeModal(item)}
                                        >
                                            <RiDeleteBin6Line className="text-2xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Topping table */}
                    <div className="col-span-1 border border-gray-300 rounded-lg shadow-lg relative mt-6 bg-white">
                        <div className='flex justify-between items-center relative -mt-6 z-[10] bg-indigo-100 mx-4 rounded-md px-3 py-3 shadow-md shadow-indigo-200'>
                            <h3 className='font-bold text-2xl text-indigo-800'>Bảng Topping</h3>
                            <button
                                className="bg-white border border-gray-300 text-indigo-500 hover:bg-indigo-800 hover:text-white rounded-full p-2 shadow transition-all"
                                onClick={() => setShowToppingModal(true)}
                            >
                                <IoAddCircleOutline className="text-2xl"/>
                            </button>
                        </div>
                        <table className="w-full bg-white text-left text-sm text-gray-800 rounded-md mt-6 table-auto">
                            <thead className="border-b border-gray-300">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">Topping</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Price</th>
                                <th className="px-6 py-4 font-medium text-gray-900 text-end"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {topping.map((item) => (
                                <tr key={item._id} className="border-b last:border-none">
                                    <td className="px-6 py-4">{item.name}</td>
                                    <td className="px-6 py-4">{item.price}</td>
                                    <td className="px-6 py-4 flex justify-end items-center">
                                        <button
                                            className="rounded-md p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-gray-100">
                                            <LiaEditSolid className="text-2xl"/>
                                        </button>
                                        <button
                                            className="ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100"
                                            onClick={() => handleOpenToppingModal(item)}
                                        >
                                            <RiDeleteBin6Line className="text-2xl"/>
                                        </button>
                                    </td>
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
