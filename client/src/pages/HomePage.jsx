import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineArrowRight, HiOutlineCalendarDays } from 'react-icons/hi2';
import {
    HiOutlineBuildingOffice2,
    HiOutlineBuildingStorefront,
    HiOutlineCake,
    HiOutlineCamera,
    HiOutlineMusicalNote,
    HiOutlineSparkles,
    HiOutlineEllipsisHorizontalCircle,
} from 'react-icons/hi2';
import { FaHandshake } from 'react-icons/fa';
import { useServices } from '@/hooks';
import ServiceGrid from '@/components/services/ServiceGrid';
import Spinner from '@/components/common/Spinner';

const CATEGORIES = [
    { value: 'venue', label: 'Venues', icon: HiOutlineBuildingOffice2, color: 'bg-purple-50 text-purple-600' },
    { value: 'hotel', label: 'Hotels', icon: HiOutlineBuildingStorefront, color: 'bg-blue-50 text-blue-600' },
    { value: 'caterer', label: 'Caterers', icon: HiOutlineCake, color: 'bg-orange-50 text-orange-600' },
    { value: 'cameraman', label: 'Cameramen', icon: HiOutlineCamera, color: 'bg-cyan-50 text-cyan-600' },
    { value: 'dj', label: 'DJs', icon: HiOutlineMusicalNote, color: 'bg-pink-50 text-pink-600' },
    { value: 'decorator', label: 'Decorators', icon: HiOutlineSparkles, color: 'bg-green-50 text-green-600' },
    { value: 'other', label: 'Other', icon: HiOutlineEllipsisHorizontalCircle, color: 'bg-gray-50 text-gray-600' },
];

const STEPS = [
    { title: 'Search Services', desc: 'Browse through hundreds of event service providers.', icon: HiOutlineMagnifyingGlass },
    { title: 'Pick Your Dates', desc: 'Select the dates that work best for your event.', icon: HiOutlineCalendarDays },
    { title: 'Book Instantly', desc: 'Confirm your booking and get ready for your event.', icon: FaHandshake },
];

export default function HomePage() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const { services: featured, loading } = useServices({ limit: 6, sort: '-createdAt' });

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/services?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20 text-white">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                        Find & Book the Perfect Services for Your Event
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
                        Venues, Hotels, Caterers, DJs, Decorators & more — all in one place
                    </p>

                    <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl gap-2">
                        <div className="relative flex-1">
                            <HiOutlineMagnifyingGlass className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Search venues, caterers, DJs…"
                                className="w-full rounded-lg border-2 border-white/40 bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-400 focus:border-white/60 focus:ring-2 focus:ring-primary-300 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-lg bg-white px-6 py-3 font-medium text-primary-700 transition-colors hover:bg-primary-50"
                        >
                            Search
                        </button>
                    </form>

                    <Link
                        to="/services"
                        className="mt-4 inline-flex items-center gap-1 text-sm text-primary-200 transition-colors hover:text-white"
                    >
                        Browse All Services <HiOutlineArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* Category Highlights */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="text-center text-2xl font-bold text-gray-900">Browse by Category</h2>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
                    {CATEGORIES.map(({ value, label, icon: Icon, color }) => (
                        <Link
                            key={value}
                            to={`/services?category=${value}`}
                            className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                        >
                            <div className={`rounded-lg p-3 ${color}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Services */}
            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center text-2xl font-bold text-gray-900">Featured Services</h2>
                    <p className="mt-2 text-center text-gray-600">Check out our latest service listings</p>

                    <div className="mt-8">
                        {loading ? (
                            <Spinner className="py-12" />
                        ) : (
                            <ServiceGrid services={featured} />
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                        >
                            View All Services <HiOutlineArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="text-center text-2xl font-bold text-gray-900">How It Works</h2>
                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div key={i} className="text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                                    <Icon className="h-8 w-8 text-primary-600" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                                <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary-600 py-16 text-white">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <h2 className="text-2xl font-bold">Are you a service provider?</h2>
                    <p className="mt-3 text-primary-100">
                        List your services on EventBook and reach thousands of event organizers.
                    </p>
                    <Link
                        to="/register"
                        className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-primary-700 transition-colors hover:bg-primary-50"
                    >
                        Get Started
                    </Link>
                </div>
            </section>
        </div>
    );
}
