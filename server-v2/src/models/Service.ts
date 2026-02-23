import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IService extends Document {
    title: string;
    category: 'venue' | 'hotel' | 'caterer' | 'cameraman' | 'dj' | 'decorator' | 'other';
    pricePerDay: number;
    description: string;
    availabilityDates: Date[];
    contactDetails: string;
    location: string;
    images: string[];
    admin: Types.ObjectId;
    createdAt: Date;
}

const serviceSchema = new Schema<IService>({
    title: { type: String, required: true, trim: true },
    category: {
        type: String,
        required: true,
        enum: ['venue', 'hotel', 'caterer', 'cameraman', 'dj', 'decorator', 'other'],
        lowercase: true,
    },
    pricePerDay: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    availabilityDates: [Date],
    contactDetails: { type: String, required: true },
    location: { type: String, required: true, trim: true, lowercase: true },
    images: { type: [String], default: [] },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

serviceSchema.index({ category: 1, location: 1, pricePerDay: 1 });

export const Service = mongoose.model<IService>('Service', serviceSchema);
