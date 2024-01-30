import Note from "../models/note.model.js";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import deepMerge from "../utils/deepMerge.js";

const createNote = async (noteBody, userId) => {
  return Note.create({ ...noteBody, createdBy: userId });
};

const queryNotes = async (userId) => {
  return Note.find({ createdBy: userId }).sort({ updatedAt: -1 });
};

const getNoteById = async (noteId) => {
  return Note.findById(noteId);
};

const updateNoteById = async (noteId, updateBody) => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, "Note not found");
  }
  deepMerge(note, updateBody);
  await note.save();
  return note;
};

const deleteNoteById = async (noteId) => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, "Note not found");
  }
  await Note.deleteOne({ _id: noteId });
};

export default {
  createNote,
  queryNotes,
  getNoteById,
  updateNoteById,
  deleteNoteById,
};
