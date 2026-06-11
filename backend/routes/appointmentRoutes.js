const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  getAvailableSlots,
  createAppointment,
  updateAppointment,
  patchAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

// GET available slots (must be before /:id)
router.get('/available-slots', getAvailableSlots);

// GET all + POST create
router.route('/').get(getAllAppointments).post(createAppointment);

// GET one + PUT update + PATCH partial + DELETE
router.route('/:id').get(getAppointmentById).put(updateAppointment).patch(patchAppointment).delete(deleteAppointment);

module.exports = router;
