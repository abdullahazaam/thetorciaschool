import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['admission', 'contact'],
      required: true,
      default: 'contact',
    },
    status: {
      type: String,
      enum: ['pending', 'replied', 'resolved'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
