import axiosClient from "./axiosClient";

const getSize = async () => {
   const res = await axiosClient.get('/size');
   return res.data;
};

const addSize = async (size) => {
   const res = await axiosClient.post('/size', { size });
   return res.data;
};

export { getSize, addSize };
