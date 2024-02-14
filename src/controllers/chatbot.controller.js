import httpStatus from "http-status";
import {
  addMessageToThreadAndRun,
  retrieveRun,
  getMessagesFromThread,
  transformOpenAIThreadMessages,
  retrieveOrCreateOpenAIThreadID,
  getMatchMentorsFunctionCall,
  handleMatchMentorsFunctionCall,
} from "../services/chatbot.service.js";
import express from "express";

/**
 * Asynchronously sends a message using the provided request and response objects.
 *
 * @param {express.Request} req - the request object
 * @param {express.Response} res - the response object
 * @return {Object} Run ID and status
 */
const sendMessage = async (req, res) => {
  const { message } = req.body;
  const threadId = await retrieveOrCreateOpenAIThreadID(req.user);
  const run = await addMessageToThreadAndRun(threadId, message);
  res.status(httpStatus.OK).send({ runId: run.id, status: run.status });
};

/**
 * Retrieves the run status and sends the response.
 *
 * @param {express.Request} req - the request object
 * @param {express.Response} res - the response object
 * @return {Object} Run ID and status
 */
const retrieveRunStatus = async (req, res) => {
  const threadId = req.user.getThreadId();
  const { id: runId } = req.params;
  // retrieve the run
  let run = await retrieveRun(threadId, runId);
  // check if run requires action
  if (run.status === "requires_action") {
    // check if match_mentors function is called
    const matchMentorsFunctionCall = getMatchMentorsFunctionCall(run);
    if (matchMentorsFunctionCall) {
      // handle match mentors function call
      run = await handleMatchMentorsFunctionCall(
        matchMentorsFunctionCall,
        req.user.id,
        threadId,
        runId
      );
    }
  }
  res.status(httpStatus.OK).send({ id: run.id, status: run.status });
};

/**
 * Retrieves messages from an openai thread and sends them as a response after transformation.
 *
 * @param {express.Request} req - the request object
 * @param {express.Response} res - the response object
 * @return {Object} - the response object containing the retrieved & transformed messages
 */
const retrieveMessages = async (req, res) => {
  const threadId = await retrieveOrCreateOpenAIThreadID(req.user);
  const threadMessagesPage = await getMessagesFromThread(threadId);
  const messages = transformOpenAIThreadMessages(
    threadMessagesPage.data
  ).reverse();
  res.status(httpStatus.OK).send({ messages });
};

export { sendMessage, retrieveRunStatus, retrieveMessages };
