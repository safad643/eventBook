import { Link } from 'react-router-dom';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-200 bg-gray-50">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
                <p className="text-sm text-gray-500">© {year} EventBook. All rights reserved.</p>

                <nav className="flex gap-6">
                    <Link to="/services" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
                        Services
                    </Link>
                    <Link to="/login" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
                        Login
                    </Link>
                    <Link to="/register" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
                        Register
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
