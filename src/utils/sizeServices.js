import instance from "@/utils/axios.config";

const getSize = async () => {
   const res = await instance.get('/size');
   return res.data;
};

export { getSize };
