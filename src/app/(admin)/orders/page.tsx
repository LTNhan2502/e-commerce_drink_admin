import {Metadata} from "next";
import ManageOrders from "@/components/orders/order.card";

export const metadata: Metadata = {
    title: "Quản lí đơn hàng",
    description: "Quản lí đơn hàng"
}

// async function OrdersData() {
//     const ordersRes = await getOrdersCache()
//
//     return(
//         <ManageOrders initOrders={ordersRes.data.result}/>
//     )
// }
//
// export default function OrdersPage() {
//     return(
//         <Suspense fallback={<LoadingOverlay/>}>
//             <OrdersData/>
//         </Suspense>
//     )
// }

const OrderPage = () => {
    return(
        <ManageOrders/>
    )
}

export default OrderPage;