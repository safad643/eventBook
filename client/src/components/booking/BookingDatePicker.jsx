import { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Given the selected startDate, compute the maximum contiguous range
 * of available dates from that start date.
 */
function getContiguousEndDates(startDate, availableDates) {
    if (!startDate || !availableDates?.length) return [];

    /* Normalise available dates to midnight timestamps for comparison */
    const available = new Set(
        availableDates.map((d) => new Date(d).setHours(0, 0, 0, 0))
    );

    const result = [];
    const oneDay = 24 * 60 * 60 * 1000;
    let current = new Date(startDate).setHours(0, 0, 0, 0);

    /* Walk forward from startDate as long as each next day is available */
    while (available.has(current)) {
        result.push(new Date(current));
        current += oneDay;
    }

    return result;
}

const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none';

export default function BookingDatePicker({
    availableDates,
    startDate,
    endDate,
    onStartChange,
    onEndChange,
}) {
    /* Parse available date strings to Date objects */
    const parsedDates = useMemo(
        () => (availableDates || []).map((d) => new Date(d)),
        [availableDates]
    );

    /* Compute valid end dates (contiguous from start) */
    const validEndDates = useMemo(
        () => getContiguousEndDates(startDate, availableDates),
        [startDate, availableDates]
    );

    /* Total days and price helpers */
    const totalDays = startDate && endDate
        ? Math.round((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1
        : 0;

    return (
        <div className="space-y-4">
            {/* Start Date */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
                <DatePicker
                    selected={startDate}
                    onChange={(d) => {
                        onStartChange(d);
                        onEndChange(null); // reset end when start changes
                    }}
                    includeDates={parsedDates}
                    placeholderText="Select start date"
                    className={inputClass}
                    dateFormat="MMM d, yyyy"
                    minDate={new Date()}
                />
            </div>

            {/* End Date */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
                <DatePicker
                    selected={endDate}
                    onChange={onEndChange}
                    includeDates={validEndDates}
                    placeholderText={startDate ? 'Select end date' : 'Pick start date first'}
                    className={inputClass}
                    dateFormat="MMM d, yyyy"
                    minDate={startDate || new Date()}
                    disabled={!startDate}
                />
            </div>

            {/* Summary */}
            {totalDays > 0 && (
                <div className="rounded-lg bg-primary-50 p-3 text-sm text-primary-800">
                    <p>
                        <span className="font-medium">Duration:</span> {totalDays} day{totalDays > 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
}
