import instance from "@/utils/axios.config";

const getMenu = async (current, pageSize) => {
    const res = await instance.get('/menu', { params: { current, pageSize } });
    return res.data;
};

const getOneMenu = async (id) => {
    const res = await instance.get(`/menu/${id}`);
    return res.data;
};

export { getMenu, getOneMenu };
