export default function ShoppingPanel({ userProducts, isOpen }) {
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
                        <div key={product.id} className="border-b p-2">
                            <p>{product.title}</p>
                            <p>{product.price ? product.price : product.discount_info}</p>
                            <p>{product.store}</p>
                        </div>
                    ))
                    ): (
                        <div className="text-center text-gray-500 py-6">
                            <p className="text-sm">Your shopping list is empty</p>
                            <p className="text-xs mt-1">Start adding items to keep track</p>
                        </div>
                    )}
                </div>
        </div>
    )
}