import instance from "@/utils/axios.config";

const getTopping = async () => {
   const res = await instance.get('/topping');
   return res.data;
};

export { getTopping };