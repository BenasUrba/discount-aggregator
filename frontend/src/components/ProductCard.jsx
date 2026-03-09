export default function ProductCard({ product }) {
    return(
        <div className="bg-white border rounded-lg p-4 shadow-sm w-full flex flex-col h-full">
            <img src={product.image} alt={product.title} className="h-40 object-contain mb-2"/>
            {product.product_brand && (
                <p className="text-xs text-gray-500 uppercase tracking-wide">{product.product_brand}</p>
            )}
            <h2 className="font-semibold text-md">{product.title}</h2>
            <h3 className="font-normal text-sm text-gray-700">
                {product.discount_description ? product.discount_description : product.description}
            </h3>
            <div className="flex items-baseline gap-2">
                {product.price && (
                    <p className="font-bold text-xl text-red-600">
                        {product.price}€
                    </p>
                )}

                {product.old_price && (
                    <p className="font-medium text-sm text-gray-400 line-through">
                        {product.old_price}€
                    </p>
                )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{product.store}</p>
        </div>
    );
}