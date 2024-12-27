'use client'
import React, {MouseEventHandler, useState} from "react";
import LoadingOverlay from "@/components/reuse/loading.overlay";

interface IToggle {
    enabled: boolean | undefined;
    setEnabled: MouseEventHandler<HTMLDivElement>;
}

const Toggle: React.FC<IToggle> = ({ enabled, setEnabled }) => {
    return (
        <>
            {/*{loading && <LoadingOverlay/>}*/}
            <div
                className={`relative w-10 h-5 flex items-center rounded-full cursor-pointer ${
                    enabled ? 'bg-indigo-500 shadow-md shadow-indigo-400' : 'bg-gray-300'
                }`}
                onClick={setEnabled}
            >
                <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-200 ${
                        enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                ></div>
            </div>
        </>
    );
};

export default Toggle;







// 'use client';
//
// const ToggleButton = () => {
//     return (
//         <label
//             htmlFor="check"
//             className="bg-gray-200 cursor-pointer relative w-10 h-5 rounded-full flex items-center peer-checked:bg-indigo-500 peer-checked:shadow-indigo-400 transition-all duration-300"
//         >
//             <input
//                 type="checkbox"
//                 id="check"
//                 className="sr-only peer"
//             />
//             <span className="w-4 h-4 bg-white absolute rounded-full left-1 top-0.5 peer-checked:left-5 transition-all duration-300"></span>
//         </label>
//     );
// };
//
// export default ToggleButton;

