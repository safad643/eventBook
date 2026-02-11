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

const createBooking = async (req, res) => {
    const { serviceId, startDate, endDate } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
        res.status(404).json({ success: false, error: 'Service not found' });
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    if (end < start) {
        res.status(400).json({ success: false, error: 'endDate must be >= startDate' });
        return;
    }

    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = totalDays * service.pricePerDay;

    const requestedDates = getDatesBetween(start, end);
    const availableDateStrings = service.availabilityDates.map(toDateString);

    const allAvailable = requestedDates.every((date) =>
        availableDateStrings.includes(toDateString(date))
    );

    if (!allAvailable) {
        res.status(400).json({ success: false, error: 'Service not available for selected dates' });
        return;
    }

    // Remove booked dates from availability
    const requestedDateStrings = requestedDates.map(toDateString);
    service.availabilityDates = service.availabilityDates.filter(
        (date) => !requestedDateStrings.includes(toDateString(date))
    );
    await service.save();

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

    // Email — don't fail booking if email fails
    try {
        const user = await User.findById(req.user.id);
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
