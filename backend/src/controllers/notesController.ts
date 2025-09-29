import { Request, Response } from 'express';
import Note from '../models/Note';
import { AuthRequest } from '../middleware/auth';

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const owner = req.userId;
    const note = await Note.create({ owner, title, content });
    return res.json({ note });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ owner: req.userId }).sort({ createdAt: -1 });
    return res.json({ notes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const note = await Note.findOne({ _id: id, owner: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    await note.remove();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
