import express from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/notesController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
router.use(requireAuth);

router.get('/', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);

export default router;
