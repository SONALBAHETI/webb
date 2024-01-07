import express from 'express';
import notesController from '../../controllers/notes.controller.js';
import auth from '../../middlewares/auth.js'; // Import your authentication middleware
import validate from '../../middlewares/validate.js';
import noteValidation from '../../validation/note.validation.js';
import catchAsync from '../../utils/catchAsync.js';

const router = express.Router();

router.use(auth()); 

router
  .route('/')
  .post(
    auth('manageNotes'),
    validate(noteValidation.createNote),
    catchAsync(notesController.createNote)
  )
  .get(
    auth('getNotes'),
    catchAsync(notesController.getNotes)
  );

router
  .route('/:noteId')
  .patch(
    auth('manageNotes'),
    validate(noteValidation.updateNote),
    catchAsync(notesController.updateNote)
  )
  .delete(
    auth('manageNotes'),
    validate(noteValidation.deleteNote),
    catchAsync(notesController.deleteNote)
  );

export default router;