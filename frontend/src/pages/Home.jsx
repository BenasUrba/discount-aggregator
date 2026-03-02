import { useState, useEffect } from "react";
import { getProducts } from "../services/api";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";

const stores = ["All Stores", "Lidl", "IKI", "Maxima", "Rimi"];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedStore, setSelectedStore] = useState("All Stores");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true)
                setError(null);
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
                <ProductList 
                    products={products}
                />
                )}
        </div>
    );
}
