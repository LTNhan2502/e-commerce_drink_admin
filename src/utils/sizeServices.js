import instance from "@/utils/axios.config";
import {unstable_cache} from "next/cache";

const getSizeCache = unstable_cache(
    async() => {
       const res = await instance.get('/size')
       return res.data;
    },
    ['size-data'],
    {
       revalidate: 180,
       tags: ['size']
    }
)

const getSize = async () => {
   const res = await instance.get('/size');
   return res.data;
};

const addSize = async (size) => {
   const res = await instance.post('/size', { size });
   return res.data;
};

const updateSize = async (id, size) => {
   const res = await instance.patch(`/size/${id}`, { size });
   return res.data;
};

const deleteSize = async (id) => {
   const res = await instance.delete(`/size/${id}`);
   return res.data;
}

export { getSize, addSize, updateSize, deleteSize, getSizeCache };
