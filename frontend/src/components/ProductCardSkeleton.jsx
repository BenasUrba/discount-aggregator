export default function ProductCardSkeleton() {
    return (
        <div className="animate-pulse bg-white border rounded-lg shadow-sm w-full flex flex-col p-4 space-y-3">
            <div className="h-40 bg-gray-300 rounded-lg"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
    );
}