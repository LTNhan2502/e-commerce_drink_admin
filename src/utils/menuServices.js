import instance from "@/utils/axios.config";
import {unstable_cache} from "next/cache";

const getMenuCache = unstable_cache(
    async (current, pageSize) => {
        const res = await instance.get('/menu', { params: { current, pageSize } });
        return res.data;
    },
    ['menu-data'],
    {
        revalidate: 180, // 300s
        tags: ['menu']
    }
)

const getMenu = async (current, pageSize) => {
    const res = await instance.get('/menu', { params: { current, pageSize } });
    return res.data;
};

const getOneMenu = async (id) => {
    const res = await instance.get(`/menu/${id}`);
    return res.data;
};



const addMenu = async (data) => {
    const res = await instance.post('/menu', data);
    return res.data;
}

const updateMenu = async (id, data) => {
    const res = await instance.patch(`/menu/${id}`, data);
    return res.data;
}

const deleteMenu = async (id) => {
    const res = await instance.delete(`/menu/${id}`);
    return res.data;
}

export { getMenu, getOneMenu, addMenu, updateMenu, deleteMenu, getMenuCache };
