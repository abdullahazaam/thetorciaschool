import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Admission', 'General'],
      default: 'General',
    },
    parentName: {
      type: String,
      required: [true, 'Please provide the parent or guardian name.'],
      trim: true,
    },
    studentName: {
      type: String,
      trim: true,
    },
    gradeApplyingFor: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone number.'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide your message or inquiry notes.'],
    },
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'Contacted', 'Archived'],
      default: 'New',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
