export default function ShoppingPanel({ userProducts, isOpen, removeProduct }) {
    return (
        <div className={`fixed top-0 right-0 h-full flex flex-col p-4 w-80 z-20 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="font-bold p-2 mb-2 text-gray-900 flex justify-between items-center">
                    <span>Your Shopping List</span>
                    {userProducts.length > 0 && (
                        <span className="text-sm text-gray-600">{userProducts.length} item{userProducts.length > 1 ? "s" : ""}</span>
                    )}
                </div>
                
                <div className="overflow-y-auto flex-1 p-2">
                    {userProducts.length > 0 ? (
                        userProducts.map((product) => (
                            <div key={product.id} className="border-b p-3 hover:bg-gray-50 transition-colors flex justify-between items-start gap-2">
                                <div className="space-y-1">
                                    <p className="line-clamp-2 text-md text-gray-900" title={product.title}>{product.title}</p>
                                    <p className="text-md font-semibold text-gray-900">{product.price ? `${product.price}€` : product.discount_info}</p>
                                    <p className="text-xs text-gray-500">{product.store}</p>
                                </div>
                                <button
                                    onClick={() => removeProduct(product.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Remove item"
                                >
                                     <svg 
                                        viewBox="0 0 24 24" 
                                        fill="none"
                                        className="w-5 h-5"
                                    >
                                        <path 
                                        d="M6 6L18 18M6 18L18 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                    ))
                    ): (
                        <div className="text-center text-gray-500 py-6">
                            <p className="text-sm">Your list is empty</p>
                            <p className="text-xs mt-1">Save products to see them here</p>
                        </div>
                    )}
                </div>
        </div>
    )
}