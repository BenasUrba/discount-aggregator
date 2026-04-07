import { useEffect, useState} from "react";

export default function useSavedProducts() {
    const [userProducts, setUserProducts] = useState([]);

    useEffect(() => {
        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        setUserProducts(savedProducts);
    }, []);

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(userProducts));
    }, [userProducts]);

    const addProduct = (product) => {
        setUserProducts(prev => [...prev, product]);
    };

    const removeProduct = (id) => {
        setUserProducts(prev => prev.filter(p => p.id !== id));
    };

    return { userProducts, addProduct, removeProduct };
}