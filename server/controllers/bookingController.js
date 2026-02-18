const Booking = require('../models/Booking');
const Service = require('../models/Service');
const {
    getDatesBetween,
    normalizeDates,
    checkAvailability,
    removeDatesFromService,
} = require('../util/bookingHelpers');
const { sendBookingEmail } = require('../utils/sendEmail');

const createBooking = async (req, res) => {
    const { serviceId, startDate, endDate } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
        res.status(404).json({ success: false, error: 'Service not found' });
        return;
    }

    const { start, end } = normalizeDates(startDate, endDate);

    if (end < start) {
        res.status(400).json({ success: false, error: 'endDate must be >= startDate' });
        return;
    }

    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = totalDays * service.pricePerDay;
    const requestedDates = getDatesBetween(start, end);

    if (!checkAvailability(service, requestedDates)) {
        res.status(400).json({ success: false, error: 'Service not available for selected dates' });
        return;
    }

    await removeDatesFromService(service, requestedDates);

    const booking = await Booking.create({
        user: req.user.id,
        service: serviceId,
        startDate: start,
        endDate: end,
        totalDays,
        totalPrice,
        status: 'confirmed',
    });

    await booking.populate('service', 'title');
    // Fire-and-forget email so response isn't blocked by SMTP latency
    sendBookingEmail(req.user.id, booking, start, end, totalDays, totalPrice);

    res.status(201).json({ success: true, booking });
};

const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id })
        .populate('service', 'title category pricePerDay location images')
        .sort('-createdAt');

    res.status(200).json({ success: true, count: bookings.length, bookings });
};

const cancelBooking = async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });

    if (!booking) {
        res.status(404).json({ success: false, error: 'Booking not found' });
        return;
    }

    if (booking.status === 'cancelled') {
        res.status(400).json({ success: false, error: 'Booking already cancelled' });
        return;
    }

    booking.status = 'cancelled';

    // Add dates back to service availability
    const datesToRestore = getDatesBetween(booking.startDate, booking.endDate);
    const service = await Service.findById(booking.service);
    if (service) {
        service.availabilityDates.push(...datesToRestore);
        await service.save();
    }

    await booking.save();

    res.status(200).json({ success: true, booking });
};

module.exports = { createBooking, getMyBookings, cancelBooking };
