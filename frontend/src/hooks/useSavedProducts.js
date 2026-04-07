import { useEffect, useState} from "react";

export default function useSavedProducts() {
    const [userProducts, setUserProducts] = useState([]);

    useEffect(() => {
        try {
            const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
            setUserProducts(savedProducts);
        } catch {
            setUserProducts([]);
        }
    }, []);

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