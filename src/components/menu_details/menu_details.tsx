'use client';
import { getSize } from '@/utils/sizeServices';
import { getTopping } from '@/utils/toppingClient';
import { useEffect, useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { LiaEditSolid } from 'react-icons/lia';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ModalSize from './modalSize';
import ModalTopping from './modalTopping';
import LoadingOverlay from "@/components/loading/loading.overlay";

export default function MenuDetailsComponent() {
    const [size, setSize] = useState<ISize[]>([]);
    const [topping, setTopping] = useState<ITopping[]>([]);
    const [loading, setLoading] = useState(false);

    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showToppingModal, setShowToppingModal] = useState(false);

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

    return (
        <>
            {loading && <LoadingOverlay />}
            <ModalSize show={showSizeModal} handleClose={() => setShowSizeModal(false)} />
            <ModalTopping show={showToppingModal} handleClose={() => setShowToppingModal(false)} />

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
                                        <button className="ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100">
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
                                            className="ml-2 rounded-md p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-gray-100">
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
