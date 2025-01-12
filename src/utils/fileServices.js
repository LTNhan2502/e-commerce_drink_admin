import instance from "./axios.config";
import {unstable_cache} from "next/cache";

const getFileCache = unstable_cache(
    async (url) => {
        const res = await instance.get(`/uploads/${url}`);
        return res.data.data.url;
    },
    ['file-data'],
    {
        revalidate: 300,
        tags: ['images']
    }
)

const uploadFile = async (file) => {
    const res = await instance.post('/upload', file, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    return res.data;
};

const getFile = async (url) => {
    const res = await instance.get(`/upload/${url}`);
    return res.data;
};

const getFiles = async () => {
    const res = await instance.get('/upload');
    return res.data;
};

export { uploadFile, getFile, getFiles, getFileCache };
