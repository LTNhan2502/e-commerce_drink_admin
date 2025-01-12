import instance from "@/utils/axios.config";
import {unstable_cache} from "next/cache";

const getCategoryCache = unstable_cache(
    async() => {
        const res = await instance.get('/category');
        return res.data;
    },
    ['category-data'],
    {
        revalidate: 180,
        tags: ['category']
    }
);

const getCategory = async () => {
    const res = await instance.get('/category');
    return res.data;
};

const getOneCategory = async (id) => {
    const res = await instance.get(`/category/${id}`);
    return res.data;
};

const addCategory = async (name) => {
    const res = await instance.post('/category', {name})
    return res.data;
}

const updateCategory = async (id, name) => {
    const res = await instance.patch(`/category/${id}`, {name})
    return res.data;
}

const deleteCategory = async (id) => {
    const res = await instance.delete(`/category/${id}`);
    return res.data;
}

export { getCategory, getOneCategory, addCategory, updateCategory, deleteCategory, getCategoryCache };
