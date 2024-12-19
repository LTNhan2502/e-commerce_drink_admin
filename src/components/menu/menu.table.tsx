'use client'
import React, {useEffect, useState} from "react";
import {getMenu} from "@/utils/menuServices";
import {getCategory} from "@/utils/categoryServices";

const MenuTable = () => {
    const authors = [
        {
            name: "John Michael",
            email: "john@creative-tim.com",
            function: "Manager",
            role: "Organization",
            status: "ONLINE",
            employed: "23/04/18",
            img: "/images/avatar1.png",
        },
        {
            name: "Alexa Liras",
            email: "alexa@creative-tim.com",
            function: "Programator",
            role: "Developer",
            status: "OFFLINE",
            employed: "11/01/19",
            img: "/images/avatar2.png",
        },
        {
            name: "Laurent Perrier",
            email: "laurent@creative-tim.com",
            function: "Executive",
            role: "Projects",
            status: "ONLINE",
            employed: "19/09/17",
            img: "/images/avatar3.png",
        },
        {
            name: "Michael Levi",
            email: "michael@creative-tim.com",
            function: "Programator",
            role: "Developer",
            status: "ONLINE",
            employed: "24/12/08",
            img: "/images/avatar4.png",
        },
        {
            name: "Richard Gran",
            email: "richard@creative-tim.com",
            function: "Manager",
            role: "Executive",
            status: "OFFLINE",
            employed: "04/10/21",
            img: "/images/avatar5.png",
        },
        {
            name: "Miriam Eric",
            email: "miriam@creative-tim.com",
            function: "Programator",
            role: "Developer",
            status: "OFFLINE",
            employed: "14/09/20",
            img: "/images/avatar6.png",
        },
    ];

    const [menu, setMenu] = useState<IProduct[]>([])
    const [category, setCategory] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true)
            try {
                const [menuRes, categoryRes] = await Promise.all([
                    getMenu(1, 30),
                    getCategory()
                ])

                setMenu(menuRes.data.result)
                setCategory(categoryRes.data)
            }catch(error){
                console.log("Failed to fetch menu and category", error)
            }finally {
                setLoading(false)
            }
        }

        fetchMenu()
    }, []);

    return (

        <div className="bg-gray-100 p-6">
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <div className="px-4 py-4 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                    Danh sách các mặt hàng
                </div>
                <table className="min-w-full bg-white">
                    <thead>
                    <tr className="w-full border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                        <th className="px-6 py-3">Author</th>
                        <th className="px-6 py-3">Function</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Employed</th>
                        <th className="px-6 py-3">Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {authors.map((author, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="flex items-center px-6 py-4">
                                <img
                                    src={author.img}
                                    alt={author.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div className="ml-3">
                                    <div className="font-medium text-gray-800">{author.name}</div>
                                    <div className="text-gray-500">{author.email}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-800">{author.function}</div>
                                <div className="text-gray-500">{author.role}</div>
                            </td>
                            <td className="px-6 py-4">
                  <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          author.status === "ONLINE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {author.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{author.employed}</td>
                            <td className="px-6 py-4 text-blue-500 hover:text-blue-700 cursor-pointer">
                                Edit
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MenuTable;
