const SIZES = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
};

export default function Spinner({ size = 'md', className = '' }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${SIZES[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`}
            />
        </div>
    );
}
