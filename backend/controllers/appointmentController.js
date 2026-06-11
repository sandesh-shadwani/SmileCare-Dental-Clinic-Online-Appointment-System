const Appointment = require('../models/Appointment');

// Helper: check if date is weekday (Mon-Fri)
const isWeekday = (date) => {
  const day = new Date(date).getUTCDay();
  return day >= 1 && day <= 5;
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
const getAllAppointments = async (req, res, next) => {
  try {
    const { status, date, dentist } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (dentist) filter.dentist = dentist;
    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setUTCHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(filter).sort({ appointmentDate: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Public
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available time slots for a date and dentist
// @route   GET /api/appointments/available-slots
// @access  Public
const getAvailableSlots = async (req, res, next) => {
  try {
    const { date, dentist } = req.query;

    if (!date || !dentist) {
      return res.status(400).json({ success: false, message: 'Date and dentist are required' });
    }

    if (!isWeekday(date)) {
      return res.status(400).json({ success: false, message: 'Appointments are only available Monday to Friday' });
    }

    const allSlots = ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00'];

    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const booked = await Appointment.find({
      appointmentDate: { $gte: start, $lte: end },
      dentist,
      status: { $in: ['pending', 'confirmed'] },
    }).select('timeSlot');

    const bookedSlots = booked.map((a) => a.timeSlot);
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({
      success: true,
      data: {
        date,
        dentist,
        availableSlots,
        bookedSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res, next) => {
  try {
    const { patientName, email, phone, appointmentDate, timeSlot, dentist, treatmentType, notes } = req.body;

    // Basic field check
    if (!patientName || !email || !phone || !appointmentDate || !timeSlot || !dentist || !treatmentType) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    // Weekday check
    if (!isWeekday(appointmentDate)) {
      return res.status(400).json({ success: false, message: 'Appointments are only available Monday to Friday' });
    }

    // Past date check
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const apptDate = new Date(appointmentDate);
    if (apptDate < today) {
      return res.status(400).json({ success: false, message: 'Appointment date cannot be in the past' });
    }

    const appointment = await Appointment.create({
      patientName,
      email,
      phone,
      appointmentDate,
      timeSlot,
      dentist,
      treatmentType,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment (full update)
// @route   PUT /api/appointments/:id
// @access  Public
const updateAppointment = async (req, res, next) => {
  try {
    const { patientName, email, phone, appointmentDate, timeSlot, dentist, treatmentType, notes, status } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointmentDate && !isWeekday(appointmentDate)) {
      return res.status(400).json({ success: false, message: 'Appointments are only available Monday to Friday' });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { patientName, email, phone, appointmentDate, timeSlot, dentist, treatmentType, notes, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Partially update appointment (status etc.)
// @route   PATCH /api/appointments/:id
// @access  Public
const patchAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const allowedFields = ['status', 'notes', 'patientName', 'phone', 'email'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Appointment.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  getAvailableSlots,
  createAppointment,
  updateAppointment,
  patchAppointment,
  deleteAppointment,
};
