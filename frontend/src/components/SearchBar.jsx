export default function SearchBar() {

    return (
        <div className="flex justify-center mb-8">
            <input
                type="text"
                placeholder="Search products..."
                className="w-full max-w-xl px-4 py-3 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    )
}