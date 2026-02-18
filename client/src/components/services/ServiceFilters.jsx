import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CATEGORIES = ['venue', 'hotel', 'caterer', 'cameraman', 'dj', 'decorator', 'other'];

const SORT_OPTIONS = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'pricePerDay', label: 'Price: Low to High' },
    { value: '-pricePerDay', label: 'Price: High to Low' },
    { value: 'title', label: 'Title: A-Z' },
];

export default function ServiceFilters({ filters, onChange, onClear }) {
    const [keyword, setKeyword] = useState(filters.keyword || '');
    const debounceRef = useRef(null);

    /* Sync keyword state when filters.keyword changes externally (e.g. clear) */
    useEffect(() => {
        setKeyword(filters.keyword || '');
    }, [filters.keyword]);

    /* Debounced keyword search */
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (keyword !== (filters.keyword || '')) {
                onChange({ keyword: keyword || undefined });
            }
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [keyword]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (key, value) => {
        onChange({ [key]: value || undefined });
    };

    const inputClass =
        'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none';
    const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

    return (
        <div className="space-y-4">
            {/* Keyword */}
            <div>
                <label className={labelClass}>Search</label>
                <input
                    type="text"
                    placeholder="Search services…"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className={inputClass}
                />
            </div>

            {/* Category */}
            <div>
                <label className={labelClass}>Category</label>
                <select
                    value={filters.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={inputClass}
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Location */}
            <div>
                <label className={labelClass}>Location</label>
                <input
                    type="text"
                    placeholder="City or area…"
                    value={filters.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className={inputClass}
                />
            </div>

            {/* Price Range */}
            <div>
                <label className={labelClass}>Price Range (₹)</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        min="0"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleChange('minPrice', e.target.value)}
                        className={inputClass}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        min="0"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handleChange('maxPrice', e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Availability Date */}
            <div>
                <label className={labelClass}>Available On</label>
                <DatePicker
                    selected={filters.date ? new Date(filters.date) : null}
                    onChange={(d) => handleChange('date', d ? d.toISOString().split('T')[0] : '')}
                    placeholderText="Pick a date"
                    minDate={new Date()}
                    className={inputClass}
                    dateFormat="MMM d, yyyy"
                    isClearable
                />
            </div>

            {/* Sort */}
            <div>
                <label className={labelClass}>Sort By</label>
                <select
                    value={filters.sort || '-createdAt'}
                    onChange={(e) => handleChange('sort', e.target.value)}
                    className={inputClass}
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Clear */}
            <button
                onClick={onClear}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
                Clear Filters
            </button>
        </div>
    );
}
