import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Appointments
export const getAllAppointments = (params = {}) => API.get('/appointments', { params });
export const getAppointmentById = (id) => API.get(`/appointments/${id}`);
export const getAvailableSlots = (date, dentist) => API.get('/appointments/available-slots', { params: { date, dentist } });
export const createAppointment = (data) => API.post('/appointments', data);
export const updateAppointment = (id, data) => API.put(`/appointments/${id}`, data);
export const patchAppointment = (id, data) => API.patch(`/appointments/${id}`, data);
export const deleteAppointment = (id) => API.delete(`/appointments/${id}`);

export default API;
