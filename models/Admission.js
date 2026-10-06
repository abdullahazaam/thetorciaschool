import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
    },
    parentName: {
      type: String,
      required: [true, 'Please provide parent name'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    grade: {
      type: String,
      required: [true, 'Please provide grade/class'],
      trim: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admission || mongoose.model('Admission', AdmissionSchema);
