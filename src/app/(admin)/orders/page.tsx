import {Metadata} from "next";
import ManageOrders from "@/components/orders/order.card";

export const metadata: Metadata = {
    title: "Quản lí đơn hàng",
    description: "Quản lí đơn hàng"
}

const OrderPage = () => {
    return(
        <ManageOrders/>
    )
}

export default OrderPage;