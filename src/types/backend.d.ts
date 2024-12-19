interface IFormData {
    username: string;
    password: string;
}

interface IProduct {
    _id: string;
    category_id: Array<string>;
    size_id: Array<string>;
    topping_id: Array<string>;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    name: string;
    size: Array<ISize>;
    images: Array<string>;
    isBestSeller: boolean;
    isOutOfStock: boolean;
    __v: number;
}

interface ISize {
    _id: string;
    size: string;
    price: number;
    isSelected: boolean;
}

interface ICategory {
    _id: string;
    name: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

