import { useState } from "react";

export default function StoreButtons({ stores, onSelectStore }) {
    const [activeStore, setActiveStore] = useState("All Stores");

    const handleStoreClick = (store) => {
        setActiveStore(store);
        onSelectStore(store);
    };

    return(
        <div className="flex justify-center flex-wrap gap-3">
            {stores.map((store) => (
                <button
                    key={store}
                    className={`px-4 py-2 rounded-lg ${
                        activeStore === store
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => handleStoreClick(store)}
                >
                    {store}
                </button>
            ))}
        </div>
    )

}