import instance from "@/utils/axios.config";
import {unstable_cache} from "next/cache";

const getToppingCache = unstable_cache(
    async() => {
       const res = await instance.get('/topping')
       return res.data
    },
    ['topping-data'],
    {
       revalidate: 180,
       tags: ['topping']
    }
)

const getTopping = async () => {
   const res = await instance.get('/topping');
   return res.data;
};

const createTopping = async (name, price) => {
   const res = await instance.post('/topping', {
      name,
      price
   });
   return res.data;
};

const updateTopping = async (id, name, price) => {
   const res = await instance.patch(`/topping/${id}`, {name, price});
   return res.data;
};

const deleteTopping = async (id) => {
   const res = await instance.delete(`topping/${id}`);
   return res.data;
}

export { getTopping, createTopping, updateTopping, deleteTopping, getToppingCache };
