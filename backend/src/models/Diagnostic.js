import mongoose from 'mongoose';

const diagnosticSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  response: {
    type: String,
    default: ''
  },
  retrievedChunks: [{
    text: String,
    similarity: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'error'],
    default: 'pending'
  },
  processingTime: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Diagnostic', diagnosticSchema);
