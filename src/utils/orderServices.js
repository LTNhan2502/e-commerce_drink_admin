import instance from "@/utils/axios.config";

const addOrder = async (data) => {
    const res = await instance.post('/order', data)
    return res.data;
}

const getOrders = async () => {
    const res = await instance.get("/order");
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
export { addOrder, getOrders, deleteOrder, changeStatus };