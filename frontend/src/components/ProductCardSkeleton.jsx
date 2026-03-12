export default function ProductCardSkeleton() {
    return (
        <div className="animate-pulse bg-white border rounded-lg shadow-sm w-full flex flex-col h-full p-4 space-y-2">
            <div className="h-40 w-full bg-gray-300 rounded-lg"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-300 rounded mt-1"></div>
            <div className="h-3 w-1/6 bg-gray-300 rounded"></div>
        </div>
    );
}