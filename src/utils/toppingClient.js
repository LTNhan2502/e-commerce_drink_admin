import axiosClient from "@/utils/axiosClient";

const getTopping = async () => {
   const res = await axiosClient.get('/topping');
   return res.data;
};

export { getTopping };