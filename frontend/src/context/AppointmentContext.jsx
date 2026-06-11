import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../services/api';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAllAppointments(params);
      setAppointments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAppointment = async (data) => {
    const res = await api.createAppointment(data);
    return res.data;
  };

  const editAppointment = async (id, data) => {
    const res = await api.updateAppointment(id, data);
    return res.data;
  };

  const removeAppointment = async (id) => {
    const res = await api.deleteAppointment(id);
    return res.data;
  };

  const updateStatus = async (id, status) => {
    const res = await api.patchAppointment(id, { status });
    return res.data;
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        fetchAppointments,
        addAppointment,
        editAppointment,
        removeAppointment,
        updateStatus,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointments must be used within AppointmentProvider');
  return ctx;
};
