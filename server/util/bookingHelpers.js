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

module.exports = {
    getDatesBetween,
    toDateString,
    normalizeDates,
    checkAvailability,
    removeDatesFromService,
    sendBookingEmail,
};
