import express from "express";
import notesController from "../../controllers/notes.controller.js";
import auth from "../../middlewares/auth.js"; // Import your authentication middleware
import validate from "../../middlewares/validate.js";
import noteValidation from "../../validation/note.validation.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router
  .route("/")
  .post(
    auth(Permission.CreateNotes),
    validate(noteValidation.createNote),
    notesController.createNote
  )
  .get(auth(Permission.ReadNotes), notesController.getNotes);

router
  .route("/:noteId")
  .get(
    auth(Permission.ReadNotes),
    validate(noteValidation.getNote),
    notesController.getNote
  )
  .patch(
    auth(Permission.UpdateNotes),
    validate(noteValidation.updateNote),
    notesController.updateNote
  )
  .delete(
    auth(Permission.DeleteNotes),
    validate(noteValidation.deleteNote),
    notesController.deleteNote
  );

export default router;