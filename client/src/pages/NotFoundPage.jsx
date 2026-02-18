import { Link } from 'react-router-dom';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

export default function NotFoundPage() {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4">
            <HiOutlineExclamationTriangle className="h-16 w-16 text-gray-300" />
            <h1 className="mt-4 text-4xl font-bold text-gray-900">404</h1>
            <p className="mt-2 text-lg text-gray-600">Page Not Found</p>
            <p className="mt-1 text-sm text-gray-400">The page you're looking for doesn't exist.</p>
            <Link
                to="/"
                className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
                Go Home
            </Link>
        </div>
    );
}
