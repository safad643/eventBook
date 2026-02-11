const Service = require('../models/Service');

const getServices = async (req, res) => {
    const { keyword, category, location, minPrice, maxPrice, date, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const filter = {};

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

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    const sortString = sort.replace(/,/g, ' ');

    const [services, total] = await Promise.all([
        Service.find(filter)
            .populate('admin', 'name')
            .sort(sortString)
            .skip(skip)
            .limit(limitNum),
        Service.countDocuments(filter),
    ]);

    res.status(200).json({
        success: true,
        count: services.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        services,
    });
};

const getServiceById = async (req, res) => {
    const service = await Service.findById(req.params.id).populate('admin', 'name');

    if (!service) {
        res.status(404).json({ success: false, error: 'Service not found' });
        return;
    }

    res.status(200).json({ success: true, service });
};

module.exports = { getServices, getServiceById };
