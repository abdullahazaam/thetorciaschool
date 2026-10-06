import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the news or event.'],
      trim: true,
      maxlength: [150, 'Title cannot be more than 150 characters.'],
    },
    category: {
      type: String,
      enum: ['News', 'Event', 'Announcement', 'Achievement'],
      default: 'News',
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide a short summary/excerpt.'],
      maxlength: [300, 'Excerpt cannot be more than 300 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the full content body.'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    eventDate: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model('News', NewsSchema);
