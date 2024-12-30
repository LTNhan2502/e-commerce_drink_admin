import instance from "@/utils/axios.config";

const getOrders = async () => {
    const res = await instance.get("/order");
    return res.data;
}
export { getOrders };