const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (store, search) => {
    let url = `${API_URL}/api/products`;

    const params = [];

    if (store && store !== "All Stores") {
        params.push(`store=${store}`);
    }

    if (search) {
        params.push(`search=${encodeURIComponent(search)}`);
    }

    if (params.length > 0) {
        url += `?${params.join("&")}`;
    }

    const response = await fetch(url);  

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
};
