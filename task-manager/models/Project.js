import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);