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

module.exports = {
    getDatesBetween,
    toDateString,
    normalizeDates,
    checkAvailability,
    removeDatesFromService,
};
