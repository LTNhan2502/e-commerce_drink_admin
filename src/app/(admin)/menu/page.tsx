import {Metadata} from "next";
import MenuTable from "@/components/menu/menu.table";

export const metadata: Metadata = {
    title: "Danh sách sản phẩm",
    description: "Danh sách sản phẩm"
}

// server component
// Fetch menu, category
// async function MenuData() {
//     const [menuRes, categoryRes] = await Promise.all([
//         getMenuCache(1, 30),
//         getCategoryCache()
//     ])
//
//     return(
//         <MenuTable initMenu={menuRes.data.result} initCategory={categoryRes.data}/>
//     )
// }

// Fetch menu images


// export default function MenuPage() {
//     return(
//         <Suspense fallback={<LoadingOverlay/>}>
//             <MenuData/>
//         </Suspense>
//     )
// }

const AdminMenu = () => {
    return(
        <MenuTable/>
    )
}

export default AdminMenu;