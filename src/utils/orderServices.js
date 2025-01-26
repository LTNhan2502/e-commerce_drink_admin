import instance from "@/utils/axios.config";
import {unstable_cache} from "next/cache";

const getOrdersCache = unstable_cache(
    async() => {
        const res = await instance.get('/order')
        return res.data
    },
    ['orders-data'],
    {
        revalidate: 180,
        tags: ['orders']
    }
)

const getOrders = async (current, pageSize) => {
    const res = await instance.get("/order", { params: { current, pageSize } });
    return res.data;
}

const addOrder = async (data) => {
    const res = await instance.post('/order', data)
    return res.data;
}

const deleteOrder = async (id) => {
    const res = await instance.delete(`/order/${id}`);
    return res.data;
}

const changeStatus = async (data) => {
    const res = await instance.patch(`/order`, data)
    return res.data;
}
export { addOrder, getOrders, deleteOrder, changeStatus, getOrdersCache };