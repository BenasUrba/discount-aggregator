export default function ProductCard({ product }) {
    return(
        <div className="bg-white border rounded-lg p-4 shadow-sm w-full flex flex-col h-full">
            <img src={product.image} alt={product.title} className="h-40 object-contain mb-2"/>
            <h2 className="font-semibold text-md">{product.title}</h2>
            <p className="font-bold text-lg">{product.price}€</p>
            <p className="text-sm text-gray-500">{product.store}</p>
        </div>
    );
}