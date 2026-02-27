const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (store) => {
    let url = `${API_URL}/api/products`;

    if (store && store !== "All Stores") {
        url += `?store=${store}`;
    }

    const response = await fetch(url);  

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
};
