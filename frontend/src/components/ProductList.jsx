import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
    if (!products || products.length === 0) {
        return <p>No Products Found.</p>
    }

    return (
        <div className="grid grid-cols-5 gap-6 mt-8 px-6 mx-24">
            {products.map((product) => (
                <ProductCard 
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
}