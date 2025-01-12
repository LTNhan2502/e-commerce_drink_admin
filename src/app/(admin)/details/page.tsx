import MenuDetailsComponent from '@/components/menu_details/menu_details';

// async function MenuDetailsData() {
//     const [sizeRes, toppingRes, categoryRes] = await Promise.all([
//         getSizeCache(),
//         getToppingCache(),
//         getCategoryCache()
//     ])
//
//     return(
//         <MenuDetailsComponent initSize={sizeRes.data} initTopping={toppingRes.data} initCategory={categoryRes.data}/>
//     )
// }
//
// export default function MenuDetailsPage() {
//     return(
//         <Suspense fallback={<LoadingOverlay/>}>
//             <MenuDetailsData/>
//         </Suspense>
//     )
// }

const MenuDetails = () => {
    return (
        <div>
            <MenuDetailsComponent />
        </div>
    );
};

export default MenuDetails;
