import { useState, useEffect } from "react";
import { getProducts } from "../services/api";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

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

            {isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8 px-4 sm:px-6 lg:px-24">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>}
            {error && <div className="mt-6 p-6 text-red-600">{error}</div>}

            {!isLoading && !error && (
                <ProductList 
                    products={products}
                />
                )}
        </div>
    );
}
