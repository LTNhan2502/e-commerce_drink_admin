interface IFormData {
    username: string;
    password: string;
}

interface IProduct {
    _id: string;
    category_id: string;
    size_id: Array<string>;
    topping_id: Array<string>;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    name: string;
    size: Array<IMenuSize>;
    images: Array<string>;
    isBestSeller: boolean;
    isOutOfStock: boolean;
    __v: number;
}

interface IProductWithImage extends IProduct{
    imageURL?: string;
}

interface IMenuSize {
    _id: string;
    size: string;
    price: number;
    isSelected: boolean;
}

interface ISize {
    _id: string;
    size: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: Date;
    __v: number;
}

interface ICategory {
    _id: string;
    name: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

interface IOrder {
    customerName: string,
    product: string,
    price: number,
    quantity: number,
    size: string,
    topping: string[],
    note: string,
    handler: string,
    time: string,
    status: string,
}

