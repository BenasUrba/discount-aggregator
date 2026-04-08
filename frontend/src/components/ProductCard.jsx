import { formatDate } from "../utils/formatDate";
import { useEffect, useState } from "react";
import { useSavedProductsContext } from "../context/SavedProductsContext";

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
    const [ready, setReady] = useState(false);
    const { addProduct, removeProduct, isProductSaved } = useSavedProductsContext();

    useEffect(() => {
        setReady(true);
    }, []);

    const dateText = 
        product.valid_from && product.valid_until ?
            `${formatDate(product.valid_from)} – ${formatDate(product.valid_until)}` :
            product.valid_from ?
            `Nuo ${formatDate(product.valid_from)}`:
            product.valid_until ?
            `Iki ${formatDate(product.valid_until)}`:
            null;

    const saved = isProductSaved(product.id)
    
    const handleClick = () => {
        saved ? removeProduct(product.id) : addProduct(product);
    };

    return(
        <div className={`bg-white border rounded-lg p-4 shadow-sm w-full flex flex-col h-full hover:border-gray-400 hover:shadow-lg transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}>
            <div className="relative h-40 w-full flex justify-center items-start">
                <img src={product.image} alt={product.title} className="max-h-full object-contain"/>
                    <div className="absolute top-1 left-1 w-7 h-7 z-10 bg-white rounded-full flex justify-center items-center shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-150" onClick={handleClick}>
                        <svg 
                            viewBox="0 0 24 24" 
                            fill={saved ? "red" : "none"} 
                            xmlns="http://www.w3.org/2000/svg"
                            stroke={saved ? "red" : "black"} 
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 transition-colors duration-300 ease-in-out">
                            <path
                                d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                            />
                        </svg>
                    </div>
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