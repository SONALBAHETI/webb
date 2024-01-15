import express from "express";
import notesController from "../../controllers/notes.controller.js";
import auth from "../../middlewares/auth.js"; // Import your authentication middleware
import validate from "../../middlewares/validate.js";
import noteValidation from "../../validation/note.validation.js";

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageNotes"),
    validate(noteValidation.createNote),
    notesController.createNote
  )
  .get(auth("getNotes"), notesController.getNotes);

router
  .route("/:noteId")
  .get(
    auth("getNotes"),
    validate(noteValidation.getNote),
    notesController.getNote
  )
  .patch(
    auth("manageNotes"),
    validate(noteValidation.updateNote),
    notesController.updateNote
  )
  .delete(
    auth("manageNotes"),
    validate(noteValidation.deleteNote),
    notesController.deleteNote
  );

export default router;