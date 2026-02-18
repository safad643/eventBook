import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const currencyFormatter = (value) => `₹${value.toLocaleString('en-IN')}`;

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
            <p className="mb-1.5 text-sm font-semibold text-gray-900">{label}</p>
            {payload.map((entry) => (
                <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
                    {entry.name}: {entry.dataKey === 'revenue' ? currencyFormatter(entry.value) : entry.value}
                </p>
            ))}
        </div>
    );
};

export default function RevenueChart({ data }) {
    const hasData = data?.some((d) => d.bookings > 0 || d.revenue > 0);

    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">Bookings & Revenue</h2>
            <p className="mt-1 text-sm text-gray-500">Last 6 months overview</p>

            <div className="mt-6" style={{ height: 370 }}>
                {!hasData ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-400">No booking data yet — chart will appear once you get bookings.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" tick={{ fontSize: 13, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickFormatter={currencyFormatter}
                                tick={{ fontSize: 13, fill: '#6b7280' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 13 }} />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="bookings"
                                name="Bookings"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#gradBookings)"
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="revenue"
                                name="Revenue"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#gradRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
