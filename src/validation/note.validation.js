import Joi from 'joi';

const createNote = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const updateNote = {
  params: Joi.object().keys({
    noteId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const deleteNote = {
  params: Joi.object().keys({
    noteId: Joi.string().required(),
  }),
};

export default {
  createNote,
  updateNote,
  deleteNote,
};
