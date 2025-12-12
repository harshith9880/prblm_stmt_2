import Patient from "../models/Patient.js";  // ✅ Local
import Document from "../models/Document.js"; // ✅ Local

// ✅ Keep these (your original)
export const listPatients = async (req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  res.json(patients);
};

export const getPatientDetails = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  res.json(patient); // ⚠️ Return patient directly, not wrapped
};

// 🆕 ADD THIS NEW FUNCTION
export const getPatientDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const docs = await Document.find({ patientId: id });
    res.json(docs);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};
