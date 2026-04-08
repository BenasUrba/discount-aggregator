import { useState, useEffect, useRef } from "react";
import { getProducts, getTopDiscounts } from "../services/api";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { Pagination } from "../components/Pagination";
import Carousel from "../components/Carousel";

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
    const [topDiscounts, setTopDiscounts] = useState([]);
    const [carouselError, setCarouselError] = useState(null);
    const [carouselLoading, setCarouselLoading] = useState(true);
    const productsRef = useRef(null);

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

    useEffect(() => {
        const fetchTopDiscounts = async () => {
            try {
                setCarouselLoading(true);
                setCarouselError(null)
                const data = await getTopDiscounts(selectedStore, 100);
                setTopDiscounts(data.products);
            } catch (err) {
                setCarouselError("Failed to fetch top discount products.");
                console.error(err);
            } finally {
                setCarouselLoading(false);
            }
        }
        fetchTopDiscounts();
    }, [selectedStore]);

    const startProducts = (currentPage - 1) * limit + 1;
    const endProducts = Math.min(currentPage * limit, totalProducts);

    useEffect(() => {
        if (!productsRef.current) return;

        const yOffset = -24;
        const y = productsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: "smooth" });
    }, [currentPage]);

    
    return (
        <div className="p-6">
            <Hero
                stores={stores}
                selectedStore={selectedStore}
                onSelectStore={setSelectedStore}
                search={search}
                setSearch={setSearch}
                productsRef={productsRef}
            />

            {currentPage === 1 && search.trim() === "" && carouselError === null && carouselLoading === false && (<Carousel
                key={selectedStore}
                products={topDiscounts}
            />)}
            

            {isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8 px-4 sm:px-6 lg:px-24">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>}
            {error && <div className="mt-6 p-6 text-red-600">{error}</div>}
            
                <div className="mt-6 px-4">
                    <p className="text-sm text-gray-600">
                        Showing {startProducts}-{endProducts} of {totalProducts} products
                    </p>
                </div>

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
