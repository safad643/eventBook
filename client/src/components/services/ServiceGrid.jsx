import ServiceCard from './ServiceCard';

export default function ServiceGrid({ services }) {
    if (!services?.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16">
                <p className="text-lg font-medium text-gray-500">No services found</p>
                <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
            ))}
        </div>
    );
}
