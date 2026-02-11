const Service = require('../models/Service');
const Booking = require('../models/Booking');
const { uploadToCloudinary } = require('../config/cloudinary');

const createService = async (req, res) => {
    const { title, category, pricePerDay, description, availabilityDates, contactDetails, location } = req.body;

    let parsedDates;
    try {
        parsedDates = JSON.parse(availabilityDates).map((d) => new Date(d));
    } catch {
        res.status(400).json({ success: false, error: 'Invalid availabilityDates format' });
        return;
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map((result) => result.secure_url);
    }

    const service = await Service.create({
        title,
        category,
        pricePerDay,
        description,
        availabilityDates: parsedDates,
        contactDetails,
        location,
        images: imageUrls,
        admin: req.user.id,
    });

    res.status(201).json({ success: true, service });
};

const updateService = async (req, res) => {
    const service = await Service.findOne({ _id: req.params.id, admin: req.user.id });

    if (!service) {
        res.status(404).json({ success: false, error: 'Service not found' });
        return;
    }

    const { title, category, pricePerDay, description, availabilityDates, contactDetails, location } = req.body;

    if (title) service.title = title;
    if (category) service.category = category;
    if (pricePerDay !== undefined) service.pricePerDay = pricePerDay;
    if (description) service.description = description;
    if (contactDetails) service.contactDetails = contactDetails;
    if (location) service.location = location;

    if (availabilityDates) {
        try {
            service.availabilityDates = JSON.parse(availabilityDates).map((d) => new Date(d));
        } catch {
            res.status(400).json({ success: false, error: 'Invalid availabilityDates format' });
            return;
        }
    }

    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
        const results = await Promise.all(uploadPromises);
        service.images = results.map((result) => result.secure_url);
    }

    await service.save();

    res.status(200).json({ success: true, service });
};

const deleteService = async (req, res) => {
    const service = await Service.findOne({ _id: req.params.id, admin: req.user.id });

    if (!service) {
        res.status(404).json({ success: false, error: 'Service not found' });
        return;
    }

    await Booking.deleteMany({ service: service._id });
    await service.deleteOne();

    res.status(200).json({ success: true, message: 'Service deleted' });
};

const getAdminBookings = async (req, res) => {
    const services = await Service.find({ admin: req.user.id }).select('_id');
    const serviceIds = services.map((s) => s._id);

    const bookings = await Booking.find({ service: { $in: serviceIds } })
        .populate('user', 'name email')
        .populate('service', 'title category')
        .sort('-createdAt');

    res.status(200).json({ success: true, count: bookings.length, bookings });
};

module.exports = { createService, updateService, deleteService, getAdminBookings };
