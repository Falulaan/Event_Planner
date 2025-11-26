import { Schema, model, models, Document, Model, Types } from 'mongoose';
import { Event } from './event.model';

/**
 * Core Booking attributes as stored in MongoDB.
 */
export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

/**
 * Booking document type with Mongoose-managed timestamps.
 */
export interface BookingDocument extends BookingAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingModel extends Model<BookingDocument> {}

/**
 * Simple but robust email format validation.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const bookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // Index improves lookups by event.
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => isValidEmail(value),
        message: 'Invalid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt/updatedAt.
    strict: true,
  }
);

// Secondary index on eventId for efficient queries.
bookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to verify that the referenced Event exists and email is valid.
 */
bookingSchema.pre<BookingDocument>('save', async function preSave(next) {
  try {
    if (!isValidEmail(this.email)) {
      throw new Error('Invalid email address');
    }

    // Ensure the referenced event exists before creating a booking.
    const eventExists = await Event.exists({ _id: this.eventId });

    if (!eventExists) {
      throw new Error('Cannot create booking: referenced event does not exist');
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Booking: BookingModel =
  (models.Booking as BookingModel) ||
  model<BookingDocument, BookingModel>('Booking', bookingSchema);

export default Booking;
