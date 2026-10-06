import mongoose from 'mongoose';

const FacultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the faculty member name'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Please provide the educational degree / qualifications'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Please provide the job designation or role'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);
