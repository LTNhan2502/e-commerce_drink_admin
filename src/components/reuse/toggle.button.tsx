import React, {useState} from "react";

interface IToggle {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

// const Toggle: React.FC<IToggle> = ({ enabled, setEnabled }) => {
const Toggle = () => {
    const [enabled, setEnabled] = useState(false);
    return (
        <div
            className={`relative w-10 h-5 flex items-center rounded-full cursor-pointer ${
                enabled ? 'bg-indigo-500 shadow-md shadow-indigo-400' : 'bg-gray-300'
            }`}
            onClick={() => setEnabled(!enabled)}
        >
            <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-200 ${
                    enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
            ></div>
        </div>
    );
};

export default Toggle;
