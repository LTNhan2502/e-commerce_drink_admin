'use client'
import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {getMenu, getOneMenu} from "@/utils/menuServices";
import {getTopping} from "@/utils/toppingClient";
import LoadingOverlay from "@/components/reuse/loading.overlay";
import {toast} from "react-toastify";
import {addOrder} from "@/utils/orderServices";

interface IAddOrderModal {
    setOrders: Dispatch<SetStateAction<IOrder[]>>;
    show: boolean;
    handleClose: () => void;
}

interface IProdS extends IProduct {
    selectedSize?: IMenuSize | null;
    topping?: IOrderTopping[];
    quantity?: number;
    description?: string
}

const AddOrderModal: React.FC<IAddOrderModal> = ({ setOrders, show, handleClose }) => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [menu, setMenu] = useState<IProduct[]>([])
    const [topping, setTopping] = useState<ITopping[]>([])
    const [tampSelectedMenuID, setTampSelectedMenuID] = useState<string>('')
    const [selectedMenu, setSelectedMenu] = useState<IProdS[]>([])
    const modalRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Hàm thay đổi name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    // Hàm thay đổi số điện thoại
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    }

    // Hàm chọn sản phẩm
    const handleChoose = async () => {
        setLoading(true);
        try {
            const res = await getOneMenu(tampSelectedMenuID)
            const fetchedProd = res.data

            setSelectedMenu((prev) => {
                // Kiểm tra xem đã có sản phẩm đã chọn trong selectedMenu chưa
                const existProd = prev.find((item) => item._id === fetchedProd._id)

                // Nếu đã tồn tại thì tăng 1
                if(existProd){
                    return prev.map((item) =>
                        item._id === existProd._id
                            ? { ...item, quantity: (item.quantity || 1) + 1 }
                            : item
                    )
                }else{
                    // Nếu chưa tồn tại thì thêm mới
                    const updatedMenu = {
                        ...fetchedProd,
                        selectedSize: null,
                        quantity: 1,
                    };
                    return [...prev, updatedMenu];
                }
            })
        }catch(error){
            console.log("Failed to fecth target menu", error)
        }finally {
            setLoading(false)
        }
    }

    // Hàm thay đổi size
    const handleSizeChange = (prodID: string, size: IMenuSize) => {
        setSelectedMenu((prev) =>
            prev.map((menu) => menu._id === prodID ? {
                ...menu,
                selectedSize: size
            } : menu)
        )
    }

    // Hàm tăng quantity
    const handleIncrease = (id: string) => {
        setSelectedMenu((prev) =>
            prev.map((item) =>
                item._id === id
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            )
        );
    }

    // Hàm giảm quantity
    const handleDecrease = (id: string) => {
        setSelectedMenu((prev) =>
            prev.map((item) =>
                item._id === id && item.quantity! > 1
                    ? { ...item, quantity: (item.quantity || 1) - 1 }
                    : item
            )
        )
    }

    // Hàm thay đổi quantity
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const value = parseInt((e.target as HTMLInputElement).value)
        if(value > 0 && !isNaN(value)) {
            setSelectedMenu((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? { ...item, quantity: value }
                        : item
                )
            )
        }
    }

    // Hàm thay đổi chọn topping
    const handleToppingChange = ( menuID: string, toppingID: string, isChecked: boolean ) => {
        // Tìm topping theo toppingID
        const selectedTopping = topping.find(t => t._id === toppingID)

        setSelectedMenu((prev) =>
            prev.map((item) =>
                item._id === menuID
                    ? {
                        ...item,
                        topping: isChecked
                            ? selectedTopping
                                ? [...(item.topping || []), selectedTopping]
                                : item.topping
                            : (item.topping || []).filter((sT) => sT._id !== toppingID),
                    }
                    : item
            )
        );
        // Thực hiện map để kiểm tra từng đối tượng
        // Nếu item._id === menuID truyền vào thì thực hiện kiểm tra
        // Nếu true thì spread selectedMenu hiện tại ra, thay đổi topping như sau
            // Nếu isChecked true thì thực hiện kiểm tra selectedTopping có tồn tại không
                // Nếu có thì spread topping hiện tại ra và thêm selectedTopping vào
                // Nếu không thì không thực hiện thay đổi
            // Nếu isCheck false thì lọc, lấy ra các topping khác với toppingName truyền vào
        // Nếu false thì trả về selectedMenu như cũ

    }
    
    // Hàm thay đổi description
    const handleDescriptionChange = (value: string, menuID: string) => {
        setSelectedMenu((prev) =>
            prev.map((item) => 
                item._id === menuID 
                    ? { ...item, description: value }
                    : item
            )
        )
    }

    // Hàm huỷ chọn các selectedMenu
    const handleCancelSelect = () => {
        handleClose()
        setSelectedMenu([])
    }

    // Hàm xác nhận order
    const handleCreateOrder = async () => {
        if(!name){
            toast.info("Vui lòng nhập tên")
            return;
        }
        if(!phone){
            toast.info("Vui lòng nhập số điện thoại")
            return;
        }
        if(!selectedMenu || selectedMenu.length < 1){
            toast.info("Vui lòng chọn sản phẩm")
            return;
        }

        setLoading(true)
        try {
            const order = {
                name: name,
                phone: phone,
                order_details: selectedMenu.map((menu) => ({
                    ...menu,
                    size: menu.selectedSize?.size,
                    price: menu.selectedSize?.price,

                })),
                status: "waiting"
            }
            const res = await addOrder(order);

            if(res){
                setOrders((prev) => [...prev, res.data]);
                handleClose()
                setName("");
                setPhone("");
                setSelectedMenu([]);
                toast.success("Thêm thành công")
                console.log(">>res", res)
            }
        }catch(error){
            console.log("Failed to create order", error)
            toast.error("Không thể thêm mới")
        }finally {
            setLoading(false)
        }
    }

    // Fetch menu, topping
    useEffect(() => {
        const fetchMenuNSizeNTopping = async() => {
            try {
                const [menuRes, toppingRes] = await Promise.all([
                    getMenu(1, 30),
                    getTopping()
                ])

                setMenu(menuRes.data.result)
                setTopping(toppingRes.data)
            }catch(error){
                console.log("Failed to fetch menu and topping", error)
            }
        }

        fetchMenuNSizeNTopping()
    }, []);

    // Kích hoạt animation, đợi animation
    useEffect(() => {
        if(show){
            setVisible(true)
        }else{
            const timer = setTimeout(() => setVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [show]);

    // Nhấn ra ngoài modal thì sẽ đóng modal
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(modalRef.current && !modalRef.current.contains(e.target as Node)){
                handleClose()
            }
        }

        if(show){
            document.addEventListener('mousedown', handleClickOutside)
        }else{
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [show, handleClose]);

    // Log selectedMenu
    useEffect(() => {
        console.log(">>Check selectedMenu", selectedMenu)
        console.log(">>Check name and phone", name, phone)
    }, [selectedMenu, name, phone]);

    return (
        <>
            {loading && <LoadingOverlay/>}
            <div
                className={`fixed inset-0 flex items-center justify-center transition-colors duration-200
                    ${visible ? "visible bg-black/50 z-50" : "invisible"}
                `}
            >
                <div
                    ref={modalRef}
                    className={`bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto transition-all duration-200
                        ${show ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                    `}
                >
                    <div className='px-6 py-4 flex justify-center items-center border-b'>
                        <h2 className='text-xl font-semibold'>Thêm mới order</h2>
                    </div>

                    <div className='px-6 py-4 mt-4'>
                        {/* Nội dung modal */}
                        <div className='flex justify-between'>
                            {/* Tên */}
                            <label className='relative w-1/2 mr-3'>
                                <input
                                    type='text'
                                    required
                                    onChange={handleNameChange}
                                    className='border rounded-md w-full px-3 py-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all peer'
                                />
                                <span
                                    className='absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75'>
                            Tên khách hàng
                        </span>
                            </label>

                            {/* Số điện thoại */}
                            <label className='relative w-1/2'>
                                <input
                                    type='text'
                                    required
                                    onChange={handlePhoneChange}
                                    className='border rounded-md w-full px-3 py-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all peer'
                                />
                                <span
                                    className='absolute rounded-md top-2 left-0 ml-1 px-3 bg-white text-gray-500 pointer-events-none transition-all peer-focus:text-indigo-800 peer-focus:-translate-y-6 peer-valid:-translate-y-6 peer-focus:scale-75 peer-valid:scale-75'>
                            Số điện thoại
                        </span>
                            </label>
                        </div>

                        {/* Dòng order detail */}
                        <div className='mt-6 flex justify-around items-center'>
                            <div className='relative shadow-inner w-1/3 h-96 rounded-md mr-3 overflow-auto'>
                                {menu.map((menuItem) => {
                                    // Kiểm tra nếu menu có size và size.length > 0
                                    if (menuItem.size.length !== 0) {
                                        return (
                                            <div
                                                key={menuItem._id}
                                                className="flex items-center space-x-2 m-2"
                                            >
                                                <input
                                                    type="radio"
                                                    id={`menu-${menuItem._id}`}
                                                    name="menu"
                                                    onChange={() => setTampSelectedMenuID(menuItem._id)}
                                                    className="hidden peer"
                                                />
                                                <label
                                                    htmlFor={`menu-${menuItem._id}`}
                                                    className="flex-1 px-4 py-2 rounded-md border cursor-pointer bg-white border-1 hover:border-gray-400 peer-checked:ring-1 peer-checked:ring-indigo-400 peer-checked:shadow-md peer-checked:shadow-indigo-400 transition-all"
                                                >
                                                    {menuItem.name}
                                                </label>
                                            </div>
                                        );
                                    }
                                    // Trường hợp không có size, không render gì
                                    return null;
                                })}
                                <button
                                    onClick={handleChoose}
                                    className='absolute bottom-3 right-3 px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 hover:shadow-md hover:shadow-indigo-400 transition-all'
                                >
                                    Chọn
                                </button>
                            </div>
                            <div className='shadow-inner w-full h-96 rounded-md overflow-y-auto'>
                                {selectedMenu ? (
                                    selectedMenu.map((menu) => (
                                        <div
                                            key={menu._id}
                                            className='px-3 py-2 m-4 rounded-md bg-white border'
                                        >
                                            <div className='flex justify-between'>
                                                <div>
                                                    <span className="font-sm text-xs text-gray-500">Sản phẩm: </span>
                                                    <span className='font-medium '>{menu.name}</span>
                                                </div>
                                                {/* Input tăng giảm số lượng */}
                                                <div>
                                                    <div className="relative flex items-center">
                                                        {/* Nút giảm */}
                                                        <button
                                                            type="button"
                                                            id="decrement-button"
                                                            onClick={() => handleDecrease(menu._id)}
                                                            className="flex-shrink-0 bg-red-100 text-red-800 inline-flex items-center justify-center border border-red-100 rounded-md h-6 w-6 focus:ring-red-700 focus:ring-1 focus:outline-none"
                                                        >
                                                            <svg
                                                                className="w-3 h-3 text-red-800"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 18 2"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M1 1h16"
                                                                />
                                                            </svg>
                                                        </button>

                                                        {/* Ô input */}
                                                        <input
                                                            type="text"
                                                            id="counter-input"
                                                            value={menu.quantity}
                                                            onChange={(e) => handleInputChange(e, menu._id)}
                                                            className="mx-2 flex-shrink-0 text-gray-900 dark:text-black border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                                            placeholder=""
                                                            required
                                                        />

                                                        {/* Nút tăng */}
                                                        <button
                                                            type="button"
                                                            id="increment-button"
                                                            onClick={() => handleIncrease(menu._id)}
                                                            className="flex-shrink-0 bg-indigo-100  inline-flex items-center justify-center border border-indigo-100 rounded-md h-6 w-6 focus:ring-indigo-800 focus:ring-1 focus:outline-none"
                                                        >
                                                            <svg
                                                                className="w-3 h-3 text-indigo-800"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 18 18"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M9 1v16M1 9h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="font-sm text-xs text-gray-500">Đơn giá: </span>
                                                <span
                                                    className='font-medium '>{menu.selectedSize ? menu.selectedSize?.price.toLocaleString() : "00.0"} VNĐ</span>
                                            </div>

                                            {/* Size */}
                                            <div>
                                                <span className="font-sm text-xs text-gray-500">Size: </span>
                                                <div className="flex flex-wrap">
                                                    {menu.size.map((size) => (
                                                        <div
                                                            key={size._id}
                                                            className='flex justify-start items-center mr-2'
                                                        >
                                                            <input
                                                                type="radio"
                                                                id={`size-${menu._id}-${size._id}`}
                                                                name={`size-${menu._id}`}
                                                                checked={menu.selectedSize?._id === size._id}
                                                                onChange={() => handleSizeChange(menu._id, size)}
                                                                className='hidden peer'
                                                            />
                                                            <label
                                                                htmlFor={`size-${menu._id}-${size._id}`}
                                                                className='px-2 py-1 w-10 text-center rounded-md border hover:border-gray-400 peer-checked:ring-1 peer-checked:ring-indigo-400 peer-checked:shadow-md peer-checked:shadow-indigo-400 transition-all'
                                                            >
                                                                {size.size}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Topping */}
                                            <div>
                                                <span className="font-sm text-xs text-gray-500">Topping: </span>
                                                <div className='flex flex-wrap'>
                                                    {/* Dùng menu.topping_id.some() để kiểm tra xem có ít nhất một topping trong menu.topping_id khớp với danh sách topping hay không */}
                                                    {/* Nếu true thì hiển thị ra */}
                                                    {/* Nếu false thì hiện dòng span dưới */}
                                                    {menu.topping_id.some((id) => topping.find((toppingID) => toppingID._id === id)) ? (
                                                        topping.map((topping) => {
                                                            const isInclude = menu.topping_id.includes(topping._id)

                                                            if(isInclude)
                                                                return (
                                                                    <div
                                                                        key={topping._id}
                                                                        className='flex justify-start items-center mr-2'
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`topping-${menu._id}-${topping._id}`}
                                                                            name={`size-${menu._id}`}
                                                                            onChange={(e) => handleToppingChange(menu._id, topping._id, e.target.checked)}
                                                                            className="h-5 w-5 appearance-none rounded border border-gray-200 focus:ring-1 focus:ring-indigo-400 checked:bg-indigo-400 relative checked:border-transparent checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white"
                                                                        />
                                                                        <label
                                                                            htmlFor={`topping-${menu._id}-${topping._id}`}
                                                                            className='pl-1'
                                                                        >
                                                                            {topping.name} - {topping.price.toLocaleString()} VNĐ
                                                                        </label>
                                                                    </div>
                                                                )
                                                        })
                                                    ) : (
                                                        <span>Chưa có topping đính kèm</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Description */}
                                            <div>
                                                <span className="font-sm text-xs text-gray-500">Ghi chú: </span>
                                                <div>
                                                    <textarea
                                                        placeholder="Nhập ghi chú..."
                                                        value={menu.description}
                                                        onChange={(e) => handleDescriptionChange(e.target.value, menu._id)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-center'>Chưa có menu nào được chọn</p>
                                )}
                            </div>
                        </div>
                        <div className='px-3 py-2 flex justify-end items-center'>
                            <button
                                onClick={handleCancelSelect}
                                className='px-4 py-2 font-medium bg-gray-100 text-gray-600 rounded-md hover:shadow-md hover:shadow-gray-400 transition-all mr-2'
                            >
                                Hủy
                            </button>
                            <button
                                className='px-4 py-2 font-medium bg-indigo-100 text-indigo-800 rounded-md hover:shadow-md hover:shadow-indigo-400 transition-all'
                                onClick={handleCreateOrder}
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default AddOrderModal;