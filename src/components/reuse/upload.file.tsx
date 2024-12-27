'use client'
import React, { useState } from "react";
import {AiOutlineCloudUpload} from "react-icons/ai";
import Image from "next/image";

interface IUploadImage {
    setFile: (file: File | null) => void;
    image: string | null;
    setImage: (image: string | null) => void;
}

const UploadImage: React.FC<IUploadImage> = ({ setFile, image, setImage }) => {
    const [fileName, setFileName] = useState<string>("");
    const [fileSize, setFileSize] = useState<string>("");

    // Hàm cho phép tải file
    const handleFile = (file: File) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            setImage(event.target?.result as string);
            setFile(file)
            setFileName(file.name);
            setFileSize((file.size / 1024).toFixed(1) + " KB");
            console.log(">>Check file", file)
        };

        reader.readAsDataURL(file);
    };

    // Hàm tải file bằng button
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            handleFile(file)
        }
    }
    // Hàm tải file bằng kéo thả
    const handleDropFile  = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0];

        if(file){
            handleFile(file)
        }
    }

    const removeImage = () => {
        setImage(null);
        setFile(null)
        setFileName("");
        setFileSize("");
    };

    return (
        <div className="w-full flex flex-col items-center gap-4 p-4">
            {/* Upload Area */}
            {!image && (
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full p-6 text-gray-500 bg-white border-2 border-dashed rounded-lg cursor-pointer border-blue-400"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropFile}
                >
                    <div className='flex flex-col gap-2 justify-center items-center'>
                        <AiOutlineCloudUpload size={'56'}/>
                        <p className='font-medium text-black text-2xl'>Kéo thả ảnh vào đây</p>
                        <p className='text-sm text-gray-400'>Hoặc</p>
                        <button
                            className='rounded-md font-medium bg-indigo-200 text-indigo-800 px-3 py-1 hover:shadow-md hover:shadow-indigo-400 transition-all'
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >Tìm ảnh</button>
                    </div>
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
            )}

            {/* Uploaded Card */}
            {image && (
                <div className="flex items-center w-full max-w-md gap-4 p-4 bg-white border rounded-lg shadow">
                    <Image
                        src={image}
                        alt="Uploaded"
                        className="object-cover w-20 h-20 rounded-md"
                        width={150}
                        height={150}
                    />
                    <div className="flex flex-col flex-grow">
                        <p className="text-gray-700">{fileName}</p>
                        <p className="text-sm text-gray-500">{fileSize}</p>
                    </div>
                    <button
                        onClick={removeImage}
                        className="px-4 py-2 text-sm font-medium text-red-800 bg-red-100 rounded hover:shadow-md hover:shadow-red-400 transition-all"
                    >
                        Xoá ảnh
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadImage;
