import { formatDate } from "../utils/formatDate";

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
        <div className="bg-white border rounded-lg p-4 shadow-sm w-full flex flex-col h-full">
            <div className="relative h-40 w-full flex justify-center items-start">
                <img src={product.image} alt={product.title} className="max-h-full object-contain"/>
                {product.discount_info && (
                    <p className="absolute top-1 right-1 bg-red-600 px-2 py-1 rounded text-white text-sm rotate-6 shadow-md">{product.discount_info}</p>
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
            </div>
            {dateText && (
                <p className="text-xs text-gray-500 mt-1">{dateText}</p>
            )}
            <p className="text-sm text-gray-500 mt-auto">{product.store}</p>
        </div>
    );
}