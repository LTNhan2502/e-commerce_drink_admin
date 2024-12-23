import instance from "@/utils/axios.config";

const getCategory = async () => {
    const res = await instance.get('/category');
    return res.data;
};

const getOneCategory = async (id) => {
    const res = await instance.get(`/category/${id}`);
    return res.data;
};

export { getCategory, getOneCategory };
