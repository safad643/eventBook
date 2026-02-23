interface FilterParams {
    keyword?: string;
    category?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    date?: string;
}

export const buildFilter = ({ keyword, category, location, minPrice, maxPrice, date }: FilterParams): Record<string, any> => {
    const filter: Record<string, any> = {};

    if (keyword) {
        filter.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
        ];
    }

    if (category) {
        filter.category = category.toLowerCase();
    }

    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
        filter.pricePerDay = {};
        if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
        if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    if (date) {
        const searchDate = new Date(date);
        searchDate.setUTCHours(0, 0, 0, 0);
        filter.availabilityDates = searchDate;
    }

    return filter;
};
