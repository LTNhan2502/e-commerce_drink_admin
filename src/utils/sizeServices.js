import instance from "@/utils/axios.config";

const getSize = async () => {
   const res = await instance.get('/size');
   return res.data;
};

const addSize = async (size) => {
   const res = await instance.post('/size', { size });
   return res.data;
};

export { getSize, addSize };
