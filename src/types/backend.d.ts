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

interface IMenuSize {
    _id?: string;
    size: string;
    price: number;
    isSelected?: boolean;
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
    _id: string;
    name: string;
    phone: number;
    order_details: IOrderDetails[];
    status: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

interface IOrderDetails {
    name: string;
    price: number;
    quantity: number;
    size: string;
    topping: IOrderTopping[];
    description: string;
}

interface IOrderTopping {
    _id: string;
    name: string;
    price: number;
}

