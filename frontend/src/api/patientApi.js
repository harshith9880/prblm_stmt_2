const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const patientApi = {
  // Get all patients
  getAllPatients: async () => {
    const response = await fetch(`${API_URL}/patients`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json();
  },

  // Get single patient
  getPatient: async (id) => {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch patient');
    return response.json();
  },

  // Create new patient (intake)
  createPatient: async (formData) => {
    const response = await fetch(`${API_URL}/intake`, {
      method: 'POST',
      body: formData, // FormData with file upload
    });
    if (!response.ok) throw new Error('Failed to create patient');
    return response.json();
  },

  // Get patient documents
  getPatientDocuments: async (patientId) => {
    try {
      const response = await fetch(`${API_URL}/patients/${patientId}/documents`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        // If endpoint doesn't exist, return empty array
        if (response.status === 404) {
          return [];
        }
        throw new Error('Failed to fetch documents');
      }
      
      return response.json();
    } catch (error) {
      console.warn('Documents not available:', error);
      return []; // Return empty array instead of throwing
    }
  },

};
