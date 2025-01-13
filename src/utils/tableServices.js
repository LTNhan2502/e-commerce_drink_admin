import instance from "@/utils/axios.config";

const getAllTable = async () => {
    const res = await instance.get('/table');
    return res.data;
}

const getOneTable = async (id) => {
    const res = await instance.get(`/table/${id}`);
    return res.data;
}

const addTable = async (number_table) => {
    const res = await instance.post('/table', { number_table })
    return res.data;
}

const updateTable = async (id, data) => {
    const res = await instance.patch(`/table/${id}`, data);
    return res.data;
}

const deleteTable = async (id) => {
    const res = await instance.delete(`/table/${id}`);
    return res.data;
}

export { getAllTable, getOneTable, addTable, updateTable, deleteTable }