import { Patient, Document } from "../../../common/db.js";


export const listPatients = async (req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  res.json(patients);
};

export const getPatientDetails = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  const docs = await Document.find({ patientId: id });
  res.json({ patient, documents: docs });
};
