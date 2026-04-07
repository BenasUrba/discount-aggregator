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
        console.log(`Product ID ${product.id} has been added`)
    };

    const removeProduct = (id) => {
        setUserProducts(prev => prev.filter(p => p.id !== id));
        console.log(`Product ID ${id} has been removed.`)
    };

    const isProductSaved = (id) => userProducts.some(p => p.id === id);

    return { userProducts, addProduct, removeProduct, isProductSaved };
};