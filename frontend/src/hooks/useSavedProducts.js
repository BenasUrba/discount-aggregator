import { useEffect, useState} from "react";

export default function useSavedProducts() {
    const [userProducts, setUserProducts] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("products") || []);
        } catch {
            return []
        }
    });

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(userProducts));
    }, [userProducts]);

    const addProduct = (product) => {
        setUserProducts(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product]);
    };

    const removeProduct = (id) => {
        setUserProducts(prev => prev.filter(p => p.id !== id));
    };

    const isProductSaved = (id) => userProducts.some(p => p.id === id);

    const clearProducts = () => setUserProducts([]);

    return { userProducts, addProduct, removeProduct, isProductSaved, clearProducts };
};