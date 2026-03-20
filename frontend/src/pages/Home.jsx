import { useState, useEffect } from "react";
import { getProducts } from "../services/api";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { Pagination } from "../components/Pagination";

const stores = ["All Stores", "Lidl", "IKI", "Maxima", "Rimi"];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedStore, setSelectedStore] = useState("All Stores");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    // const [limit, setLimit] = useState(40);
    const limit = 40;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search && search.trim().length > 0 && search.trim().length < 3) {
                return;
            }
            const fetchProducts = async () => {
                try {
                    setIsLoading(true)
                    setError(null);
                    
                    const data = await getProducts(selectedStore, search, currentPage, limit);
                    setProducts(data.products);
                    setTotalPages(data.totalPages);
                    setTotalProducts(data.totalProducts);
                } catch (err) {
                    setError("Failed to load products.");
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProducts();
        }, 300);

        return () => clearTimeout(timeout);

    }, [selectedStore, search, currentPage, limit]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStore, search]);
    
    return (
        <div className="p-6">
            <Hero
                stores={stores}
                selectedStore={selectedStore}
                onSelectStore={setSelectedStore}
                search={search}
                setSearch={setSearch}
            />

            {isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8 px-4 sm:px-6 lg:px-24">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>}
            {error && <div className="mt-6 p-6 text-red-600">{error}</div>}
            
            <h3>Products Available: {totalProducts}</h3>
            {!isLoading && !error && (
                <ProductList 
                    products={products}
                />
                )}
                
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </div>
    );
}
