export default function StoreButtons({ stores, selectedStore, onSelectStore }) {
    
    return(
        <div className="flex justify-center flex-wrap gap-3">
            {stores.map((store) => (
                <button
                    key={store}
                    className={`px-4 py-2 rounded-lg ${
                        selectedStore === store
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => onSelectStore(store)}
                >
                    {store}
                </button>
            ))}
        </div>
    )

}