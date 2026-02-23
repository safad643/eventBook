import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
    user: Types.ObjectId;
    service: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    totalPrice: number;
    status: 'confirmed' | 'cancelled';
    createdAt: Date;
}

const bookingSchema = new Schema<IBooking>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    createdAt: { type: Date, default: Date.now },
});

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ service: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
