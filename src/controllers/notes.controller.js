import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
console.log
import noteService from "../services/notes.service.js";

const createNote = catchAsync(async (req, res) => {
  const note = await noteService.createNote(req.body, req.user._id);
  res.status(httpStatus.CREATED).json(note);
});

const getNotes = catchAsync(async (req, res) => {
  const userId = req.user._id; 
  const notes = await noteService.queryNotes(userId);
  res.status(httpStatus.OK).json(notes);
});

const updateNote = catchAsync(async (req, res) => {
  const note = await noteService.updateNoteById(req.params.noteId, req.body);
  res.status(httpStatus.OK).json(note);
});

const deleteNote = catchAsync(async (req, res) => {
  await noteService.deleteNoteById(req.params.noteId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
