import { formatDate } from "../utils/formatDate";

const loyaltyBadge = {
    Lidl: { src: "/lidlPlus-icon.png", className: "h-8 w-8"},
    IKI: { src: "/ikiLoyalty-icon.png", className: "h-6 w-8"},
    Maxima: { src: "/maximaLoyalty-icon.png", className: "h-6 w-8"},
    Rimi: { src: "/rimiLoyalty-icon.png", className: "h-7 w-8"}
}

const storeSizes = {
    IKI: { src: "/ikiStore.svg", className: "h-4 w-4"},
    Maxima: { src: "/maximaStore.png", className: "h-3 w-3" }
}

export default function ProductCard({ product }) {
    const dateText = 
        product.valid_from && product.valid_until ?
            `${formatDate(product.valid_from)} – ${formatDate(product.valid_until)}` :
            product.valid_from ?
            `Nuo ${formatDate(product.valid_from)}`:
            product.valid_until ?
            `Iki ${formatDate(product.valid_until)}`:
            null;

    return(
        <div className="bg-white border rounded-lg p-4 shadow-sm w-full flex flex-col h-full hover:border-gray-400 hover:shadow-lg transition">
            <div className="relative h-40 w-full flex justify-center items-start">
                <img src={product.image} alt={product.title} className="max-h-full object-contain"/>
                {product.discount_info && (
                    <p className="absolute top-1 right-1 bg-red-600 px-2 py-1 rounded text-white text-sm rotate-6 shadow-md">{product.discount_info}</p>
                )}
                {product.loyalty_required && loyaltyBadge[product.store] && (
                    <img
                        src={loyaltyBadge[product.store].src}
                        className={`absolute bottom-2 right-2 rounded ${loyaltyBadge[product.store].className}`}
                        alt={`${product.store} loyalty badge`}
                    />
                )}
            </div>
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

                {!product.price && !product.old_price && product.discount_info && (
                    <p className="font-semibold text-lg text-red-600">
                        {product.discount_info}
                    </p>
                )}
            </div>
            {dateText && (
                <p className="text-xs text-gray-500 mt-1">{dateText}</p>
            )}
            <div className="flex flex-row justify-between mt-auto">
                <p className="text-sm text-gray-500">{product.store}</p>
                <div className="flex flex-row">
                    {product.store_size > 0 && 
                            Array.from({ length: product.store_size }).map((_, index) => (
                                <img
                                    key={index}
                                    src={storeSizes[product.store].src}
                                    className={storeSizes[product.store].className}
                                    alt={`${product.store} store size`}
                                />
                            ))
                    }
                </div>
            </div>
        </div>
    );
}