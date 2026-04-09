import { useState, useEffect, useRef } from "react";
import { getProducts, getTopDiscounts } from "../services/api";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { Pagination } from "../components/Pagination";
import Carousel from "../components/Carousel";
import ShoppingPanel from "../components/ShoppingPanel";
import { useSavedProductsContext } from "../context/SavedProductsContext";

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
    const { userProducts } = useSavedProductsContext();
    const [isOpen, setIsOpen] = useState(false);

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

            <button 
                className={`fixed top-1/4 bg-white text-gray p-3 h-20 border z-30 transition-all duration-300 ease-in-out ${isOpen ? "right-80" : "right-0"} rounded-sm`}
                onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                ) : (
                <div className="relative">
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                    >
                    <path 
                        d="M8 6L21 6M8 12L21 12M8 18L21 18M4 6C4 6.28 3.78 6.5 3.5 6.5C3.22 6.5 3 6.28 3 6C3 5.72 3.22 5.5 3.5 5.5C3.78 5.5 4 5.72 4 6ZM4 12C4 12.28 3.78 12.5 3.5 12.5C3.22 12.5 3 12.28 3 12C3 11.72 3.22 11.5 3.5 11.5C3.78 11.5 4 11.72 4 12ZM4 18C4 18.28 3.78 18.5 3.5 18.5C3.22 18.5 3 18.28 3 18C3 17.72 3.22 17.5 3.5 17.5C3.78 17.5 4 17.72 4 18Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                    {userProducts.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                            {userProducts.length}
                        </span>
                    )}
                </div>
                )}
            </button>

            <ShoppingPanel
                userProducts={userProducts}
                isOpen={isOpen}
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
