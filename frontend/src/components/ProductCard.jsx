export default function ProductCard({ product }) {
    return(
        <div className="bg-white border rounded-lg p-4 shadow-sm w-64 flex flex-col h-full">
            <img src={product.image} alt="Product Image"/>
            <h2 className="font-semibold">{product.title}</h2>
            <p>Price: {product.price}</p>
            <p className="text-sm text-gray-500">{product.store}</p>
        </div>
    );
}