import instance from "@/utils/axios.config";

const getTopping = async () => {
   const res = await instance.get('/topping');
   return res.data;
};

const deleteTopping = async (id) => {
   const res = await instance.delete(`topping/${id}`);
   return res.data;
}

export { getTopping, deleteTopping };