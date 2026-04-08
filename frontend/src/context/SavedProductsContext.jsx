import { createContext, useContext } from "react";
import useSavedProducts from "../hooks/useSavedProducts";

const SavedProductsContext = createContext();

export function SavedProductsProvider({ children }) {
    const savedProducts = useSavedProducts();

    return (
        <SavedProductsContext.Provider value={savedProducts}>
            {children}
        </SavedProductsContext.Provider>
    );
}

export function useSavedProductsContext() {
    return useContext(SavedProductsContext);
}