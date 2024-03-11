import httpStatus from "http-status";
import responseHandler from "../utils/responseHandler.js";
import noteService from "../services/notes.service.js";

const createNote = responseHandler(async (req, res) => {
  const note = await noteService.createNote(req.body, req.user._id);
  res.status(httpStatus.CREATED).json({ note: note.toJSON() });
});

const getNotes = responseHandler(async (req, res) => {
  const userId = req.user._id;
  const notes = await noteService.queryNotes(userId);
  const notesJSON = notes.map((note) => note.toJSON());
  res.status(httpStatus.OK).json({ notes: notesJSON });
});

const getNote = responseHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.params.noteId);
  res.status(httpStatus.OK).json({ note: note.toJSON() });
});

const updateNote = responseHandler(async (req, res) => {
  const note = await noteService.updateNoteById(req.params.noteId, req.body);
  res.status(httpStatus.OK).json({ note: note.toJSON() });
});

const deleteNote = responseHandler(async (req, res) => {
  await noteService.deleteNoteById(req.params.noteId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createNote,
  getNote,
  getNotes,
  updateNote,
  deleteNote,
};
