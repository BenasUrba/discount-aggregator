import StoreButtons from "./StoreButtons";
import SearchBar from "./SearchBar";

export default function Hero({ stores, selectedStore, onSelectStore, search, setSearch }) {

    return (
        <header className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                All Discounts From Lithuanian Grocery Stores
            </h1>
            <p className="text-gray-600 text-xl mb-8">
                Compare prices and find the best deals — save time and money!
            </p>

            <SearchBar
                search={search}
                setSearch={setSearch}
            />

            <StoreButtons
                stores={stores}
                selectedStore={selectedStore}
                onSelectStore={onSelectStore}
            />
        </header>
    );
}