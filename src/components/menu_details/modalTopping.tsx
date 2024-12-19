interface ModalToppingProps {
    show: boolean;
    handleClose: () => void;
}

function ModalTopping({ show, handleClose }: ModalToppingProps) {

    return (
        <div className={`fixed inset-0 flex items-center justify-center transition-colors
         ${show ? 'visible bg-black bg-opacity-50 z-50' : 'invisible'}`}>
            <div className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-auto transition-all
            ${show ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}>
                <div className="border-b px-4 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-medium">Thêm Topping Mới</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        ✖
                    </button>
                </div>
                <div className="p-4">
                    {/* Thêm form input ở đây */}
                </div>
                <div className="border-t px-4 py-3 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalTopping;
