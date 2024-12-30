import instance from "@/utils/axios.config";

const getOrders = async () => {
    const res = await instance.get("/order");
    return res.data;
}
const deleteOrder = async (id) => {
    const res = await instance.delete(`/order/${id}`);
    return res.data;
}
export { getOrders, deleteOrder };