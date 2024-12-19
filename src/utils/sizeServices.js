import axiosClient from "./axiosClient";

const getSize = async () => {
   const res = await axiosClient.get('/size');
   return res.data;
};

export { getSize };
