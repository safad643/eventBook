import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { HiOutlineXMark } from 'react-icons/hi2';
import 'react-datepicker/dist/react-datepicker.css';

const CATEGORIES = ['venue', 'hotel', 'caterer', 'cameraman', 'dj', 'decorator', 'other'];

const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';
const errorClass = 'mt-1 text-xs text-red-600';

export default function ServiceForm({ initialData = null, onSubmit, loading }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [pricePerDay, setPricePerDay] = useState(initialData?.pricePerDay || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [location, setLocation] = useState(initialData?.location || '');
    const [contactDetails, setContactDetails] = useState(initialData?.contactDetails || '');
    const [dates, setDates] = useState(() => {
        if (!initialData?.availabilityDates) return [];
        return initialData.availabilityDates.map((d) => new Date(d));
    });
    const [images, setImages] = useState(null);
    const [errors, setErrors] = useState({});

    const isEdit = Boolean(initialData);

    const validate = () => {
        const errs = {};
        if (!title.trim()) errs.title = 'Title is required';
        if (!category) errs.category = 'Category is required';
        if (!pricePerDay || Number(pricePerDay) <= 0) errs.pricePerDay = 'Price must be a positive number';
        if (!description.trim()) errs.description = 'Description is required';
        if (!location.trim()) errs.location = 'Location is required';
        if (!contactDetails.trim()) errs.contactDetails = 'Contact details are required';
        if (dates.length === 0) errs.dates = 'Select at least one availability date';
        if (images && images.length > 5) errs.images = 'Maximum 5 images allowed';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('category', category);
        formData.append('pricePerDay', Number(pricePerDay));
        formData.append('description', description.trim());
        formData.append('location', location.trim());
        formData.append('contactDetails', contactDetails.trim());

        const dateStrings = dates.map((d) => d.toISOString().split('T')[0]);
        formData.append('availabilityDates', JSON.stringify(dateStrings));

        if (images) {
            Array.from(images).forEach((file) => formData.append('images', file));
        }

        onSubmit(formData);
    };

    const removeDate = (index) => {
        setDates((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDateChange = (date) => {
        if (!date) return;
        const exists = dates.some(
            (d) => d.toDateString() === date.toDateString()
        );
        if (exists) {
            setDates((prev) => prev.filter((d) => d.toDateString() !== date.toDateString()));
        } else {
            setDates((prev) => [...prev, date]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Title, Category, Price — horizontal */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label className={labelClass}>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Sunset Grand Hall" />
                    {errors.title && <p className={errorClass}>{errors.title}</p>}
                </div>
                <div>
                    <label className={labelClass}>Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                        <option value="">Select category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </select>
                    {errors.category && <p className={errorClass}>{errors.category}</p>}
                </div>
                <div>
                    <label className={labelClass}>Price Per Day (₹)</label>
                    <input type="number" min="0" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} className={inputClass} placeholder="25000" />
                    {errors.pricePerDay && <p className={errorClass}>{errors.pricePerDay}</p>}
                </div>
            </div>

            {/* Row 2: Description — full width, compact */}
            <div>
                <label className={labelClass}>Description</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="Describe the service…" />
                {errors.description && <p className={errorClass}>{errors.description}</p>}
            </div>

            {/* Row 3: Location, Contact — horizontal */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className={labelClass}>Location</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="Mumbai" />
                    {errors.location && <p className={errorClass}>{errors.location}</p>}
                </div>
                <div>
                    <label className={labelClass}>Contact Details</label>
                    <input type="text" value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} className={inputClass} placeholder="Phone or email" />
                    {errors.contactDetails && <p className={errorClass}>{errors.contactDetails}</p>}
                </div>
            </div>

            {/* Row 4: Availability Dates + Images — side by side */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                    <label className={labelClass}>Availability Dates</label>
                    <DatePicker
                        selected={null}
                        onChange={handleDateChange}
                        highlightDates={dates}
                        minDate={new Date()}
                        placeholderText="Click dates on the calendar"
                        className={inputClass}
                        dateFormat="MMM d, yyyy"
                        inline
                    />
                    {dates.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {dates
                                .sort((a, b) => a - b)
                                .map((d, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700">
                                        {d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        <button type="button" onClick={() => removeDate(i)} className="hover:text-primary-900">
                                            <HiOutlineXMark className="h-3.5 w-3.5" />
                                        </button>
                                    </span>
                                ))}
                        </div>
                    )}
                    {errors.dates && <p className={errorClass}>{errors.dates}</p>}
                </div>

                <div>
                    <label className={labelClass}>Images (max 5)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setImages(e.target.files)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {errors.images && <p className={errorClass}>{errors.images}</p>}

                    {/* Preview new files */}
                    {images && images.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {Array.from(images).map((file, i) => (
                                <img key={i} src={URL.createObjectURL(file)} alt={`preview-${i}`} className="h-20 w-20 rounded-lg object-cover" />
                            ))}
                            {isEdit && <p className="mt-1 w-full text-xs text-amber-600">New images will replace existing ones.</p>}
                        </div>
                    )}

                    {/* Show existing images in edit mode when no new files */}
                    {isEdit && !images && initialData?.images?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {initialData.images.map((url, i) => (
                                <img key={i} src={url} alt={`existing-${i}`} className="h-20 w-20 rounded-lg object-cover" />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Saving…' : isEdit ? 'Update Service' : 'Create Service'}
            </button>
        </form>
    );
}
