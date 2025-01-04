import {Metadata} from "next";
import MenuTable from "@/components/menu/menu.table";

export const metadata: Metadata = {
    title: "Danh sách sản phẩm",
    description: "Danh sách sản phẩm"
}

const AdminMenu = () => {
    return(
        <MenuTable/>
    )
}

export default AdminMenu;