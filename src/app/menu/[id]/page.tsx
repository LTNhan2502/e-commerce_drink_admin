'use client'
import ToggleButton from "@/components/reuse/toggle.button";
import UploadImage from "@/components/reuse/upload.file";
import React, {useEffect, useState} from "react";
import {getOneMenu, updateMenu} from "@/utils/menuServices";
import {getFile, uploadFile} from "@/utils/fileServices";
import LoadingOverlay from "@/components/reuse/loading.overlay";
import {getSize} from "@/utils/sizeServices";
import {getTopping} from "@/utils/toppingClient";
import {AiOutlineSave} from "react-icons/ai";
import {toast} from "react-toastify";
import {getCategory} from "@/utils/categoryServices";
import instance from "@/utils/axios.config";

// export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
//     const { id } = params;
//
//     return {
//         title: `Chỉnh sửa sản phẩm - ${id}`,
//         description: "Chỉnh sửa và xem sản phẩm",
//     };
// }

const DetailMenuPage = ({ params }: { params: { id: string } }) => {
    const [menu, setMenu] = useState<IProduct | null>(null)
    const [category, setCategory] = useState<ICategory[]>([]);
    const [size, setSize] = useState<ISize[]>([])
    const [topping, setTopping] = useState<ITopping[]>([])
    const [productName, setProductName] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false)
    const [isBestSeller, setIsBestSeller] = useState<boolean>(false)
    const [selectedSize, setSelectedSize] = useState<IMenuSize[]>([])
    const [selectedTopping, setSelectedTopping] = useState<string[]>([])
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null); // Lưu file thực tê
    const [loading, setLoading] = useState<boolean>(false);

    // Hàm thay đổi tên sản phẩm
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductName(e.target.value);
    }

    // Hàm thay đổi category
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCat = e.target.value
        setSelectedCategory(selectedCat)
    }

    // Hàm thay đổi tồn kho
    const handleStockChange = (status: boolean) => {
        setIsOutOfStock(!status)
    }

    // Hàm thay đổi best seller
    const handleBestSellerChange = (status: boolean) => {
        setIsBestSeller(!status)
    }

    // Hàm thay đổi size
    const handleSizeChange = (sizeName: string, isSelected: boolean) => {
        // Nếu chưa chọn và khi nhấn chọn thì isSelected true, truyền vào selectedSize, ngược lại
        setSelectedSize((prevSize) => {
            if(isSelected){
                return [
                    ...prevSize,
                    { size: sizeName, price: 0 }
                ]
            }else{
                return prevSize.filter((prev) => prev.size !== sizeName)
            }
        })
    }

    // Hàm thay đổi giá của size
    const handlePriceChange = (sizeName: string, price: number) => {
        setSelectedSize((prevSize) =>
            prevSize.map((size) =>
                size.size === sizeName
                    ? { ...size, price } // Cập nhật giá nếu tìm thấy size
                    : size
            )
        );
    };

    // Hàm thay đổi topping
    const handleToppingChange = (toppingID: string, isSelected: boolean) => {
        setSelectedTopping((prevTopping) => {
            if(isSelected){
                return [...prevTopping, toppingID];
            }else{
                return prevTopping.filter(prevToppingID => prevToppingID !== toppingID );
            }
        });
    }

    // Hàm xác nhận những thay đổi trong div thông tin sản phẩm
    const handleSaveProductInfo = async () => {
        setLoading(true);
        try {
            const updatedMenu = {
                ...menu,
                name: productName,
                category_id: selectedCategory,
                isOutOfStock: isOutOfStock,
                isBestSeller: isBestSeller
            }
            const res = await updateMenu(params.id, updatedMenu)

            if(res){
                toast.success("Lưu thành công")
            }
        }catch(error){
            console.log("Failed to save product info", error)
            toast.error("Lưu thất bại")
        }finally {
            setLoading(false)
        }
    }

    // Hàm xác nhận thay đổi ảnh
    const handleSaveImag = async () => {
        if(!file){
            toast.info("Vui lòng chọn ảnh trước khi lưu")
            return;
        }else{
            const formData = new FormData();
            formData.append('file', file)

            try {
                setLoading(true)
                const resUpload = await instance.post('/upload', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                const updatedMenu = {
                    ...menu,
                    images: resUpload.data.data.data.publicId
                }
                await updateMenu(params.id, updatedMenu)
                toast.success("Lưu thành công")
            }catch(error){
                console.log("Failed to save image", error)
                toast.error("Lưu thất bại")
            }finally {
                setLoading(false)
            }
        }

    }

    // Hàm xác nhận những thay đổi của size
    const handleSaveSize = async () => {
        setLoading(true)
        try {
            // Ép size mới vào menu.size
            const updatedMenu = {
                ...menu,
                size: selectedSize.map(({ size, price }) => ({ size, price })),
            }

            const res = await updateMenu(params.id, updatedMenu);
            if(res){
                toast.success("Lưu thành công")
            }
        }catch(error){
            console.log("Failed to save", error)
            toast.error("Không thể lưu")
        }finally {
            setLoading(false)
        }
    }

    // Hàm xác nhận những thay đổi của topping
    const handleSaveTopping = async () => {
        setLoading(true)
        try {
            const updatedMenu = {
                ...menu,
                topping_id: selectedTopping
            }

            const res = await updateMenu(params.id, updatedMenu);

            if(res){
                toast.success("Lưu thành công")
            }
        }catch(error){
            console.log("Failed to save topping", error)
            toast.error("Lưu topping thất bại")
        }finally {
            setLoading(false)
        }
    }

    // Set giá trị mặc định cho tên sản phẩm
    useEffect(() => {
        if(menu?.name){
            setProductName(menu.name)
        }
    }, [menu]);

    // Set giá trị mặc định cho selectedCategory
    useEffect(() => {
        if(menu?.category_id){
            setSelectedCategory(menu.category_id)
        }
    }, [menu]);

    // Set giá trị mặc định cho tồn kho
    useEffect(() => {
        if(menu?.isOutOfStock){
            setIsOutOfStock(menu.isOutOfStock)
        }
    }, [menu]);

    // Set giá trị mặc định cho best seller
    useEffect(() => {
        if(menu?.isBestSeller){
            setIsBestSeller(menu.isBestSeller)
        }
    }, [menu]);

    // Set giá trị mặc định cho selectedSize là các tên size đã được chọn
    useEffect(() => {
        if (menu?.size) {
            const initialValues: IMenuSize[] = size
                .filter((s) => menu.size.some((menuSize) => menuSize.size === s.size))
                .map((s) => {
                    // Tìm đối tượng trong menu.size khớp với s.size
                    const matchingMenuSize = menu.size.find((menuSize) => menuSize.size === s.size);
                    return {
                        size: s.size,
                        price: matchingMenuSize?.price || 0, // Gắn giá trị price nếu tìm thấy
                    };
                });
            setSelectedSize(initialValues);
        }
    }, [menu, size]);

    // Set giá trị mặc định cho selectedTopping là các _id đã được chọn
    useEffect(() => {
        if(menu?.topping_id){
            const initialValues = topping
                .filter((t) => menu.topping_id.some((menuTopping) => menuTopping === t._id))
                .map((t) => t._id);
            setSelectedTopping(initialValues)
        }
    }, [menu, topping]);

    // Fetch menu dựa vào params trên url
    useEffect(() => {
        const fetchMenuNSizeNToppingNCategory = async () => {
            setLoading(true);
            try {
                const [menuRes, sizeRes, toppingRes, categoryRes] = await Promise.all([
                    getOneMenu(params.id),
                    getSize(),
                    getTopping(),
                    getCategory()
                ])

                setMenu(menuRes.data)
                setSize(sizeRes.data)
                setTopping(toppingRes.data)
                setCategory(categoryRes.data)
            }catch(error){
                console.log("Failed to fetch menu", error)
            }finally {
                setLoading(false);
            }
        }

        fetchMenuNSizeNToppingNCategory()
    }, [params.id])

    // Fetch image url
    useEffect(() => {
        if(!menu) return;

        const fetchImageURL = async () => {
            setLoading(true);
            try {
                if(menu.images && menu.images[0]) {
                    const res = await getFile(menu.images[0]);
                    setImage(res.data.data.url);
                }
            }catch(error){
                console.log(">>Failed to fetch image url", error)
            }finally {
                setLoading(false);
            }
        }

        fetchImageURL()
    }, [menu]);

    console.log(">>menu", menu)

    return (
        <>
            {loading && <LoadingOverlay/>}
            <div className="flex flex-wrap gap-4 px-5 py-4">
                <div className="flex flex-col flex-1">
                    {/* Tên, giá, trạng thái tồn kho và best seller */}
                    <div className='relative rounded-md shadow-md px-4 py-3 bg-white mb-6'>
                        <h3 className="font-bold text-2xl mb-4">Thông tin sản phẩm</h3>
                        <button
                            className='absolute top-0 right-0 bg-indigo-100 text-indigo-800 hover:shadow-md hover:shadow-indigo-400 transition-all px-2 py-1'
                            style={{
                                borderTopRightRadius: '8px',
                                borderBottomLeftRadius: '8px',
                            }}
                            onClick={handleSaveProductInfo}
                        >
                            <AiOutlineSave size={24}/>
                        </button>
                        <div className="">
                            <input
                                type="text"
                                placeholder="Tên sản phẩm"
                                value={productName}
                                onChange={handleNameChange}
                                className='w-full px-3 py-2 border rounded-md hover:border-gray-400 focus:ring-1 focus:outline-none focus:ring-indigo-500 focus:shadow-md focus:shadow-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2'
                            />
                        </div>
                        <div className="mt-8 flex justify-between">
                            <select
                                name="select-box"
                                id="select-box-id"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className='w-1/3 px-3 py-2 border rounded-md hover:border-gray-400 focus:ring-1 focus:outline-none focus:ring-indigo-500 focus:shadow-md focus:shadow-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2'
                            >
                                {category.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <div className='w-1/3 ml-3 px-3 py-2 flex justify-between items-center border-l-2'>
                                <p>Tồn kho</p>
                                <ToggleButton enabled={!isOutOfStock} setEnabled={() => handleStockChange(isOutOfStock)}/>
                            </div>
                            <div className='w-1/3 ml-3 px-3 py-2 flex justify-between items-center border-l-2 '>
                                <p>Best seller</p>
                                <ToggleButton enabled={isBestSeller} setEnabled={() => handleBestSellerChange(isBestSeller)}/>
                            </div>
                        </div>
                    </div>

                    {/* Ảnh */}
                    <div className='relative rounded-md px-4 py-3 bg-white'>
                        <h3 className="font-bold text-2xl mb-4">Hình ảnh sản phẩm</h3>
                        <button
                            className='absolute top-0 right-0 bg-indigo-100 text-indigo-800 hover:shadow-md hover:shadow-indigo-400 transition-all px-2 py-1'
                            style={{
                                borderTopRightRadius: '8px',
                                borderBottomLeftRadius: '8px'
                            }}
                            onClick={handleSaveImag}
                        >
                            <AiOutlineSave size={24}/>
                        </button>
                        <UploadImage setFile={setFile} image={image} setImage={setImage}/>
                    </div>

                </div>

                <div className="relative flex-1 min-w-[300px] max-w-[500px]">
                    {/* Size */}
                    <div className='px-4 py-3 bg-white rounded-md shadow-md'>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-2xl mb-4">Size</h3>
                            <button
                                className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 px-2 py-1 hover:shadow-md hover:shadow-indigo-400 transition-all"
                                style={{
                                    borderTopRightRadius: '8px',
                                    borderBottomLeftRadius: '8px',
                                }}
                                onClick={handleSaveSize}
                            >
                                <AiOutlineSave size={24}/>
                            </button>
                        </div>

                        <fieldset aria-label="Choose sizes" className="mt-4 px-3">
                            <div className="space-y-4">
                                {size.length === 0 ? (
                                    <div className="text-center py-6 font-bold text-md">Không có Size</div>
                                ) : (
                                    size.map((size) => {
                                        const selected = selectedSize.find((prevS) => prevS.size === size.size)
                                        console.log(">>chekc selected", selected)
                                        return (
                                            <label
                                                key={size._id}
                                                className="flex items-center justify-between border-b py-3"
                                            >
                                                {/* Thông tin size */}
                                                <div>
                                                    <p className="text-base font-medium text-gray-800">{size.size}</p>
                                                    {selected ? (
                                                        // Nếu checkbox được chọn, hiển thị input để nhập price
                                                        <input
                                                            type="number"
                                                            value={selected.price || ""}
                                                            onChange={(e) => handlePriceChange(size.size, Number(e.target.value))}
                                                            placeholder="Nhập giá"
                                                            className="text-sm border rounded-md hover:border-gray-400 focus:ring-1 focus:outline-none focus:ring-indigo-500 focus:shadow-md focus:shadow-indigo-400 transition-all placeholder:transition placeholder:translate-x-0 focus:placeholder:translate-x-2 px-2 py-1 w-40"
                                                        />
                                                    ) : (
                                                        // Nếu checkbox không được chọn, hiển thị giá hoặc thông báo
                                                        <p className="text-sm text-gray-500">Chưa có giá</p>
                                                    )}
                                                </div>

                                                {/* Checkbox */}
                                                <input
                                                    type="checkbox"
                                                    checked={!!selected}
                                                    onChange={(e) => handleSizeChange(size.size, e.target.checked)}
                                                    className="h-5 w-5 appearance-none rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 checked:bg-indigo-500 relative checked:border-transparent checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:shadow-md checked:shadow-indigo-400 transition-all"
                                                />
                                            </label>
                                        )
                                    })
                                )}
                            </div>
                        </fieldset>
                    </div>

                    {/* Topping */}
                    <div className='relative px-4 py-3 bg-white rounded-md shadow-md mt-6'>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-2xl mb-4">Topping</h3>
                            <button
                                className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 px-2 py-1 hover:shadow-md hover:shadow-indigo-400 transition-all"
                                style={{
                                    borderTopRightRadius: '8px',
                                    borderBottomLeftRadius: '8px',
                                }}
                                onClick={handleSaveTopping}
                            >
                                <AiOutlineSave size={24}/>
                            </button>
                        </div>

                        <fieldset aria-label="Choose toppings" className="mt-4 px-3">
                            <div className="space-y-4">
                                {topping.length === 0 ? (
                                    <div className="text-center py-6 font-bold text-md">Không có Topping</div>
                                ) : (
                                    topping.map((topping) => (
                                    <label
                                        key={topping._id}
                                        className="flex items-center justify-between border-b py-3"
                                    >
                                        {/* Thông tin topping */}
                                        <div>
                                            <p className="text-base font-medium text-gray-800">{topping.name}</p>
                                            <p className="text-sm text-gray-500">{topping.price}đ</p>
                                        </div>

                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={selectedTopping.includes(topping._id)}
                                            onChange={(e) =>handleToppingChange(topping._id, e.target.checked) }
                                            className="h-5 w-5 appearance-none rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 checked:bg-indigo-500 relative checked:border-transparent checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:shadow-md checked:shadow-indigo-400 transition-all"
                                        />
                                    </label>
                                ))
                                )}
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailMenuPage;
