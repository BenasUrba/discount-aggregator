import { useState, useEffect } from "react";
import { getProducts } from "../services/api";

function Home() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                setError("Failed to load products.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return <div className="p-6">Loading Products...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Deals</h1>

            {products.length === 0 ? (
                <p>No Products Found.</p>
            ) : (
                <ul className="space-y-2">
                    {products.map((product) => (
                        <li key={product.id} className="border p-4 rounded">
                            <h2 className="font-semibold">{product.title}</h2>
                            <p>Price: {product.price}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Home;