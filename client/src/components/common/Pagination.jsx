import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

/**
 * Generates the page numbers to display: [1, '...', 4, 5, 6, '...', 10]
 */
function getPageNumbers(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [1];

    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) pages.push('...');
    pages.push(total);

    return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = getPageNumbers(currentPage, totalPages);

    return (
        <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous page"
            >
                <HiChevronLeft className="h-5 w-5" />
            </button>

            {/* Page numbers */}
            {pages.map((page, index) =>
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${page === currentPage
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Next page"
            >
                <HiChevronRight className="h-5 w-5" />
            </button>
        </nav>
    );
}
