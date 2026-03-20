export function Pagination({ currentPage, setCurrentPage, totalPages }) {
    let pageLimit = 7;
    let startPage = 1;
    let endPage = Math.min(pageLimit, totalPages);

    if (currentPage > pageLimit - 2) {
        startPage = Math.max(currentPage - 4, 1);
        endPage = Math.min(startPage + pageLimit - 1, totalPages);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex flex-row mt-20 justify-center gap-3">
            <button
                className="p-3 text-lg rounded-lg font-medium shadow font-sans hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {startPage > 1 && (
                <>
                    <button
                        className={`p-3 text-lg bg-gray-200 rounded-lg shadow font-sans  hover:bg-white transition`}
                        onClick={() => setCurrentPage(1)}
                    >
                        1
                    </button>
                    <span className="p-2 text-lg">...</span>
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    className={`p-3 text-lg rounded-lg shadow font-sans hover:bg-white transition ${page === currentPage ? `bg-blue-500 text-white hover:text-black`: `bg-gray-200`}`}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    <span className="p-2 text-lg">...</span>
                    <button
                        className={`p-3 text-lg bg-gray-200 rounded-lg shadow font-sans hover:bg-white transition`}
                        onClick={() => setCurrentPage(totalPages)}
                    >   
                        {totalPages}
                    </button>
                </>
            )}

            <button
                className="p-3 text-lg rounded-lg font-medium shadow font-sans hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
}