import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please provide a question'],
      trim: true,
      maxlength: [300, 'Question cannot exceed 300 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Please provide an answer'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Admissions',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Faq || mongoose.model('Faq', FaqSchema);
