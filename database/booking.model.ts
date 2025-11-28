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

// Compound unique index to prevent duplicate bookings (same event + email).
bookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

/**
 * Pre-save hook to verify that the referenced Event exists.
 * Email validation is already handled by the schema validator.
 * This hook only validates on new bookings or when eventId is modified.
 */
bookingSchema.pre<BookingDocument>('save', async function preSave() {
    // Only validate eventId if it's new or modified to avoid redundant checks
    if (this.isNew || this.isModified('eventId')) {
        // Ensure the referenced event exists before creating a booking
        const eventExists = await Event.exists({_id: this.eventId});

        if (!eventExists) {
            throw new Error('Cannot create booking: referenced event does not exist');
        }
    }
});

export const Booking: BookingModel =
  (models.Booking as BookingModel) ||
  model<BookingDocument, BookingModel>('Booking', bookingSchema);

export default Booking;
