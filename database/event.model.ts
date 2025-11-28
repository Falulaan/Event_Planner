import { Schema, model, models, Document, Model } from 'mongoose';

/**
 * Core Event attributes as stored in MongoDB.
 */
export interface EventAttrs {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // 24h time string (HH:MM)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

/**
 * Event document type with Mongoose-managed timestamps.
 */
export interface EventDocument extends EventAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface EventModel extends Model<EventDocument> {}

/**
 * Helper to generate a URL-safe slug from an event title.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Normalize a date input to `YYYY-MM-DD` (ISO calendar date) format.
 */
function normalizeDate(dateInput: string): string {
  const parsed = new Date(dateInput);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid event date');
  }

  // Use local date components to avoid timezone shift
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalize time into a strict 24h `HH:MM` format.
 * Supports both 24-hour format (HH:MM) and 12-hour format (HH:MM AM/PM).
 */
function normalizeTime(timeInput: string): string {
  const trimmed = timeInput.trim();

  // Check for 12-hour format with AM/PM
  const amPmMatch = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM)$/i.exec(trimmed);
  if (amPmMatch) {
    let hours = parseInt(amPmMatch[1], 10);
    const minutes = amPmMatch[2];
    const period = amPmMatch[3].toUpperCase();

    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  // Check for 24-hour format
  const match24h = /^([01]?\d|2[0-3]):([0-5][0-9])$/.exec(trimmed);
  if (!match24h) {
    throw new Error('Invalid event time; expected HH:MM or HH:MM AM/PM');
  }

  const hours = match24h[1].padStart(2, '0');
  const minutes = match24h[2];

  return `${hours}:${minutes}`;
}

const requiredString = {
  type: String,
  required: true,
  trim: true,
  validate: {
    validator: (value: string) => value.trim().length > 0,
    message: 'Field is required and cannot be empty',
  },
};

const requiredStringArray = {
  type: [String],
  required: true,
  validate: {
    validator: (value: string[]) =>
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((v) => typeof v === 'string' && v.trim().length > 0),
    message: 'Array must contain at least one non-empty string',
  },
};

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: requiredString,
    slug: {
      ...requiredString,
      unique: true, // Unique index for slug-based lookups.
    },
    description: requiredString,
    overview: requiredString,
    image: requiredString,
    venue: requiredString,
    location: requiredString,
    date: requiredString,
    time: requiredString,
    mode: requiredString,
    audience: requiredString,
    agenda: requiredStringArray,
    organizer: requiredString,
    tags: requiredStringArray,
  },
  {
    timestamps: true, // Automatically manage createdAt/updatedAt.
    strict: true,
  }
);

// Unique index on slug to enforce URL uniqueness at the database level.
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook to:
 * - generate or update the slug when the title changes
 * - normalize and validate date and time fields.
 */
eventSchema.pre<EventDocument>('save', function preSave(next) {
  try {
    // Generate slug only if title is new or modified.
    if (this.isModified('title')) {
      const slug = generateSlug(this.title);

      if (!slug) {
        throw new Error('Slug cannot be empty');
      }

      this.slug = slug;
    }

    // Normalize date and time on every save to keep them consistent.
    this.date = normalizeDate(this.date);
    this.time = normalizeTime(this.time);

  }catch (error) {
  }
}

);

export const Event: EventModel =
  (models.Event as EventModel) || model<EventDocument, EventModel>('Event', eventSchema);

export default Event;
