import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled' },
  content: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Note', NoteSchema);
