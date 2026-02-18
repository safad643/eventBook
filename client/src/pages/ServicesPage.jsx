import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ServiceFilters from '../components/services/ServiceFilters';
import ServiceGrid from '../components/services/ServiceGrid';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';

const FILTER_KEYS = ['keyword', 'category', 'location', 'minPrice', 'maxPrice', 'date', 'sort'];

export default function ServicesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    /* Read current filters from URL */
    const filters = {};
    for (const key of FILTER_KEYS) {
        const val = searchParams.get(key);
        if (val) filters[key] = val;
    }
    const currentPage = Number(searchParams.get('page')) || 1;

    /* Fetch services whenever URL params change */
    useEffect(() => {
        const controller = new AbortController();

        const fetchServices = async () => {
            setLoading(true);
            try {
                const params = { ...filters, page: currentPage, limit: 9 };
                const { data } = await API.get('/services', { params, signal: controller.signal });
                setServices(data.services);
                setTotalPages(data.pages);
            } catch (error) {
                if (error.name !== 'CanceledError') {
                    console.error('Failed to fetch services:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
        return () => controller.abort();
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Update a single filter key in URL */
    const handleFilterChange = (updates) => {
        const next = new URLSearchParams(searchParams);
        next.delete('page'); // reset page when filters change

        for (const [key, value] of Object.entries(updates)) {
            if (value) {
                next.set(key, value);
            } else {
                next.delete(key);
            }
        }

        setSearchParams(next);
    };

    const handleClearFilters = () => {
        setSearchParams({});
    };

    const handlePageChange = (page) => {
        const next = new URLSearchParams(searchParams);
        next.set('page', page);
        setSearchParams(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">All Services</h1>
            <p className="mt-1 text-sm text-gray-600">Find the perfect service for your event</p>

            {/* Mobile filter toggle */}
            <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 lg:hidden"
            >
                {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className="mt-6 flex gap-8">
                {/* Filters sidebar */}
                <aside className={`w-full shrink-0 lg:block lg:w-64 ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
                    <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-4">
                        <h2 className="mb-4 text-sm font-semibold text-gray-900">Filters</h2>
                        <ServiceFilters filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
                    </div>
                </aside>

                {/* Results */}
                <div className="min-w-0 flex-1">
                    {loading ? (
                        <Spinner className="py-20" />
                    ) : (
                        <>
                            <ServiceGrid services={services} />
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
