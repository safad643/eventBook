const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const getDatesBetween = (start, end) => {
    const dates = [];
    const current = new Date(start);
    current.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setUTCHours(0, 0, 0, 0);

    while (current <= endDate) {
        dates.push(new Date(current));
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
};

const toDateString = (date) => new Date(date).toISOString().split('T')[0];

const normalizeDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);
    return { start, end };
};

const checkAvailability = (service, requestedDates) => {
    const availableDateStrings = service.availabilityDates.map(toDateString);
    return requestedDates.every((date) =>
        availableDateStrings.includes(toDateString(date))
    );
};

const removeDatesFromService = async (service, requestedDates) => {
    const requestedDateStrings = requestedDates.map(toDateString);
    service.availabilityDates = service.availabilityDates.filter(
        (date) => !requestedDateStrings.includes(toDateString(date))
    );
    await service.save();
};

const sendBookingEmail = async (userId, booking, start, end, totalDays, totalPrice) => {
    try {
        const user = await User.findById(userId);
        await sendEmail({
            to: user.email,
            subject: 'Booking Confirmation — Event Booking Platform',
            html: `
                <h2>Booking Confirmed!</h2>
                <p><strong>Service:</strong> ${booking.service.title}</p>
                <p><strong>Dates:</strong> ${toDateString(start)} to ${toDateString(end)}</p>
                <p><strong>Total Days:</strong> ${totalDays}</p>
                <p><strong>Total Price:</strong> ₹${totalPrice}</p>
                <p><strong>Status:</strong> Confirmed</p>
            `,
        });
    } catch (emailError) {
        console.error('Booking email failed:', emailError.message);
    }
};

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
    await sendBookingEmail(req.user.id, booking, start, end, totalDays, totalPrice);

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
