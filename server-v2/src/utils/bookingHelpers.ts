export const getDatesBetween = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];
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

export const toDateString = (date: Date): string => new Date(date).toISOString().split('T')[0];

export const normalizeDates = (startDate: string, endDate: string): { start: Date; end: Date } => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);
    return { start, end };
};

export const checkAvailability = (availabilityDates: Date[], requestedDates: Date[]): boolean => {
    const availableDateStrings = availabilityDates.map(toDateString);
    return requestedDates.every((date) => availableDateStrings.includes(toDateString(date)));
};
