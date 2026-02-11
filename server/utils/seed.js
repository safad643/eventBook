require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

const generateDates = (daysFromNow, count) => {
    const dates = [];
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() + daysFromNow);

    for (let i = 0; i < count; i++) {
        const date = new Date(start);
        date.setUTCDate(date.getUTCDate() + i);
        dates.push(date);
    }
    return dates;
};

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
    });

    const user = await User.create({
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
        role: 'user',
    });

    console.log('Created users');

    const services = await Service.create([
        {
            title: 'Grand Palace Banquet Hall',
            category: 'venue',
            pricePerDay: 25000,
            description: 'A luxurious banquet hall with capacity for 500 guests, complete with stage, lighting, and parking.',
            availabilityDates: generateDates(1, 30),
            contactDetails: '+91 9876543210',
            location: 'mumbai',
            images: [
                'https://via.placeholder.com/800x600?text=Venue+1',
                'https://via.placeholder.com/800x600?text=Venue+2',
                'https://via.placeholder.com/800x600?text=Venue+3',
            ],
            admin: admin._id,
        },
        {
            title: 'Riverside Luxury Hotel',
            category: 'hotel',
            pricePerDay: 8000,
            description: 'Premium hotel with 50 rooms for guest accommodation, swimming pool, and complimentary breakfast.',
            availabilityDates: generateDates(1, 30),
            contactDetails: '+91 9876543211',
            location: 'delhi',
            images: [
                'https://via.placeholder.com/800x600?text=Hotel+1',
                'https://via.placeholder.com/800x600?text=Hotel+2',
                'https://via.placeholder.com/800x600?text=Hotel+3',
            ],
            admin: admin._id,
        },
        {
            title: 'Royal Feast Catering',
            category: 'caterer',
            pricePerDay: 15000,
            description: 'Multi-cuisine catering service for up to 300 guests. Includes appetizers, main course, desserts, and beverages.',
            availabilityDates: generateDates(1, 30),
            contactDetails: '+91 9876543212',
            location: 'bangalore',
            images: [
                'https://via.placeholder.com/800x600?text=Catering+1',
                'https://via.placeholder.com/800x600?text=Catering+2',
                'https://via.placeholder.com/800x600?text=Catering+3',
            ],
            admin: admin._id,
        },
        {
            title: 'ProShot Photography & Videography',
            category: 'cameraman',
            pricePerDay: 12000,
            description: 'Professional photography and 4K videography team with drone coverage, same-day edits, and cinematic highlights.',
            availabilityDates: generateDates(1, 30),
            contactDetails: '+91 9876543213',
            location: 'mumbai',
            images: [
                'https://via.placeholder.com/800x600?text=Camera+1',
                'https://via.placeholder.com/800x600?text=Camera+2',
                'https://via.placeholder.com/800x600?text=Camera+3',
            ],
            admin: admin._id,
        },
        {
            title: 'BeatDrop DJ & Sound',
            category: 'dj',
            pricePerDay: 7000,
            description: 'High-energy DJ with professional sound system, LED lights, fog machines, and custom playlist curation.',
            availabilityDates: generateDates(1, 30),
            contactDetails: '+91 9876543214',
            location: 'delhi',
            images: [
                'https://via.placeholder.com/800x600?text=DJ+1',
                'https://via.placeholder.com/800x600?text=DJ+2',
                'https://via.placeholder.com/800x600?text=DJ+3',
            ],
            admin: admin._id,
        },
        {
            title: 'Elegance Event Decorators',
            category: 'decorator',
            pricePerDay: 20000,
            description: 'Full event decoration including floral arrangements, stage design, entrance arches, and themed setups.',
            availabilityDates: generateDates(1, 30),
            contactDetails: '+91 9876543215',
            location: 'bangalore',
            images: [
                'https://via.placeholder.com/800x600?text=Decor+1',
                'https://via.placeholder.com/800x600?text=Decor+2',
                'https://via.placeholder.com/800x600?text=Decor+3',
            ],
            admin: admin._id,
        },
    ]);

    console.log('Created 6 services');

    // Book 2 services for the user (remove those dates from availability)
    const bookingService1 = services[0]; // venue
    const bookingService2 = services[1]; // hotel

    const booking1Start = new Date(bookingService1.availabilityDates[0]);
    const booking1End = new Date(bookingService1.availabilityDates[2]);
    const booking1Days = 3;
    const booking1Price = booking1Days * bookingService1.pricePerDay;

    const booking2Start = new Date(bookingService2.availabilityDates[0]);
    const booking2End = new Date(bookingService2.availabilityDates[1]);
    const booking2Days = 2;
    const booking2Price = booking2Days * bookingService2.pricePerDay;

    await Booking.create([
        {
            user: user._id,
            service: bookingService1._id,
            startDate: booking1Start,
            endDate: booking1End,
            totalDays: booking1Days,
            totalPrice: booking1Price,
            status: 'confirmed',
        },
        {
            user: user._id,
            service: bookingService2._id,
            startDate: booking2Start,
            endDate: booking2End,
            totalDays: booking2Days,
            totalPrice: booking2Price,
            status: 'confirmed',
        },
    ]);

    // Remove booked dates from service availability
    bookingService1.availabilityDates = bookingService1.availabilityDates.slice(3);
    await bookingService1.save();

    bookingService2.availabilityDates = bookingService2.availabilityDates.slice(2);
    await bookingService2.save();

    console.log('Created 2 bookings');

    console.log('\n--- Seed Complete ---');
    console.log('Admin: admin@test.com / password123');
    console.log('User:  john@test.com / password123');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
};

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
