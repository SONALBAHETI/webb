import Note from '../models/note.js';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';

const createNote = async (noteBody, userId) => {
  return Note.create({ ...noteBody, createdBy: userId });
};

const queryNotes = async (userId) => {
  return Note.find({ createdBy: userId }).sort({ createdAt: -1 });
};


const updateNoteById = async (noteId, updateBody) => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  Object.assign(note, updateBody);
  await note.save();
  return note;
};

const deleteNoteById = async (noteId) => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  await Note.deleteOne({ _id: noteId }); 
};

export default {
  createNote,
  queryNotes,
  updateNoteById,
  deleteNoteById,
};
