import { useState, useEffect } from "react";
import { getProducts } from "../services/api";
import Hero from "../components/Hero";

const stores = ["All Stores", "Lidl", "IKI", "Maxima", "Rimi"];

function Home() {
    const [products, setProducts] = useState([]);
    const [selectedStore, setSelectedStore] = useState("All Stores");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true)
                const data = await getProducts(selectedStore);
                setProducts(data);
            } catch (err) {
                setError("Failed to load products.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [selectedStore]);
    return (
        <div className="p-6">
            <Hero
                stores={stores}
                selectedStore={selectedStore}
                onSelectStore={setSelectedStore}
            />

            {isLoading && <div className="mt-6 p-6">Loading Products...</div>}
            {error && <div className="mt-6 p-6 text-red-600">{error}</div>}

            {!isLoading && !error && (
                <div className="mt-8 space-y-4">
                    {products.length === 0 ? (
                        <p>No Products Found.</p>
                    ): (
                        products.map((product) => (
                            <div key={product.id} className="border p-4 rounded bg-white">
                                <h2 className="font-semibold">{product.title}</h2>
                                <p>Price: {product.price}</p>
                                <p className="text-sm text-gray-500">{product.store}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;
