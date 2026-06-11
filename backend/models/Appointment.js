const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, 'Please enter a valid phone number'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      enum: ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00'],
    },
    dentist: {
      type: String,
      required: [true, 'Dentist selection is required'],
      enum: ['Dr. Sarah Ahmed', 'Dr. Omar Khalid', 'Dr. Fatima Rizvi'],
    },
    treatmentType: {
      type: String,
      required: [true, 'Treatment type is required'],
      enum: [
        'General Checkup',
        'Teeth Cleaning',
        'Cavity Filling',
        'Root Canal',
        'Tooth Extraction',
        'Orthodontics Consultation',
        'Teeth Whitening',
        'Dental X-Ray',
        'Other',
      ],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double-booking: same date + same timeSlot + same dentist
appointmentSchema.index({ appointmentDate: 1, timeSlot: 1, dentist: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
