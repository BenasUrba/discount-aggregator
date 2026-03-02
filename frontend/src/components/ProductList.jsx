import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
    if (!products || products.length === 0) {
        return <p>No Products Found.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8 px-4 sm:px-6 lg:px-24 justify-items-center">
            {products.map((product) => (
                <ProductCard 
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
}