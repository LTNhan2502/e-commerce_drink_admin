'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getSize } from '@/utils/sizeServices';
import { getTopping } from '@/utils/toppingClient';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { IoAddCircleOutline } from 'react-icons/io5';
import { LiaEditSolid } from 'react-icons/lia';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ModalComponent from './modalSize';
import ModalSize from './modalSize';
import ModalTopping from './modalTopping';

export default function MenuDetailsComponent() {
    const [size, setSize] = useState<ISize[]>([]);
    const [topping, setTopping] = useState<ITopping[]>([]);

    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showToppingModal, setShowToppingModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sizeRes, toppingRes] = await Promise.all([getSize(), getTopping()]);
                setSize(sizeRes.data);
                setTopping(toppingRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    // console.log(size);
    // console.log(topping);

    return (
        <>
            <ModalSize show={showSizeModal} handleClose={() => setShowSizeModal(false)} />
            <ModalTopping show={showToppingModal} handleClose={() => setShowToppingModal(false)} />
            <div className='container-xl mx-auto mt-3 text-end'>
                <div className='grid grid-cols-3 md:grid-cols-12 gap-4'>
                    <div className='col-span-12 md:col-span-6 overflow-x-auto rounded-lg shadow-lg'>
                        <button
                            className='bg-blue-500 text-white my-3 mx-3 px-4 py-2 rounded-md'
                            onClick={() => setShowSizeModal(true)}
                        >
                            <IoAddCircleOutline className='text-2xl' />
                        </button>
                        <table className='w-full bg-white text-left text-sm text-gray-800 rounded-md'>
                            <thead className='bg-indigo-100'>
                                <tr>
                                    <th className='px-6 py-4 font-medium text-gray-900'>Size</th>
                                    <th className='px-6 py-4 font-medium text-gray-900'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {size.map((item) => (
                                    <tr className='hover:bg-gray-100'>
                                        <td className='px-6 py-4'>{item.size}</td>
                                        <td className='px-6 py-4'>
                                            <button className='rounded px-4 py-2 text-white hover:text-blue-600/100'>
                                                <LiaEditSolid className='text-blue-600/50 font-medium text-2xl' />
                                            </button>
                                            <button className='ml-2 rounded px-4 py-2 text-white hover:text-red-600'>
                                                <RiDeleteBin6Line className='text-red-600/50 font-medium text-2xl' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='col-span-12 md:col-span-6 overflow-x-auto rounded-lg shadow-lg'>
                        <button
                            className='bg-blue-500 text-white my-3 mx-3 px-4 py-2 rounded-md'
                            onClick={() => setShowToppingModal(true)}
                        >
                            <IoAddCircleOutline className='text-2xl' />
                        </button>
                        <table className='w-full border-collapse bg-white text-left text-sm text-gray-500'>
                            <thead className='bg-indigo-100'>
                                <tr>
                                    <th className='px-6 py-4 font-medium text-gray-900'>Topping</th>
                                    <th className='px-6 py-4 font-medium text-gray-900'>Price</th>
                                    <th className='px-6 py-4 font-medium text-gray-900'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {topping.map((item) => (
                                    <tr className='hover:bg-gray-100'>
                                        <td className='px-6 py-4'>{item.name}</td>
                                        <td className='px-6 py-4'>{item.price}</td>
                                        <td className='px-6 py-4'>
                                            <button className='rounded px-4 py-2 text-white hover:text-blue-600/100'>
                                                <LiaEditSolid className='text-blue-600/50 font-medium text-2xl' />
                                            </button>
                                            <button className='ml-2 rounded px-4 py-2 text-white hover:text-red-600'>
                                                <RiDeleteBin6Line className='text-red-600/50 font-medium text-2xl' />
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
