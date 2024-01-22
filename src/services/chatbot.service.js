import config from "../config/config.js";
import * as openai from "../providers/openai/api.js";
import { Document } from "mongoose";
import User from "../models/user.model.js";
import OpenAI from "openai";
import { updateOpenAIThreadId } from "./user.service.js";

const assistantId = config.openAI.mentorFinderAssistantId;

/**
 * Retrieves or creates an OpenAI thread ID for the given user.
 *
 * @param {Document<User>} user - The user object.
 * @return {Promise<string>} The OpenAI thread ID.
 */
const retrieveOrCreateOpenAIThreadID = async (user) => {
  const threadId = user.getThreadId();
  if (!threadId) {
    const newThread = await createNewThread();
    await updateOpenAIThreadId(user.id, newThread.id);
    return newThread.id;
  }
  return Promise.resolve(threadId);
};

/**
 * Adds a message to the specified thread and creates a run with the assistant ID.
 *
 * @param {string} threadId - The ID of the thread
 * @param {string} message - The message to be added to the thread
 * @return The created run
 */
const addMessageToThreadAndRun = async (threadId, message) => {
  // add message to thread
  await openai.addMessageToThread(threadId, message);
  // create a run on the thread with the assistant ID
  const run = await openai.createRun(threadId, assistantId);
  return run;
};

/**
 * Retrieves messages from a thread
 * @param {string} threadID - The ID of the thread to retrieve messages from
 * @returns Resolves with the messages from the thread with pagination
 */
const getMessagesFromThread = async (threadID) => {
  const threadMessagesPage = await openai.retrieveMessagesFromThread(threadID);
  return threadMessagesPage;
};

/**
 * @typedef {Object} TransformedMessage
 * @property {string} id - The id of the message
 * @property {string} content - The content of the message
 * @property {"assistant" | "user"} role - The role of the sender
 */
/**
 * Transforms an array of thread messages from openai.
 *
 * @param {Array<OpenAI.Beta.Threads.Messages.ThreadMessage>} threadMessages - The array of thread messages to transform.
 * @return {Array<TransformedMessage>} The transformed array of thread messages.
 */
const transformOpenAIThreadMessages = (threadMessages) => {
  return threadMessages.map((m) => ({
    id: m.id,
    content: m.content,
    role: m.role,
  }));
};

/**
 * Retrieves a run from OpenAI based on the provided thread ID and run ID.
 *
 * @param {string} threadId - The ID of the thread.
 * @param {string} runId - The ID of the run.
 * @throws {Error} If the thread ID or run ID are missing.
 * @return The retrieved run object.
 */
const retrieveRun = async (threadId, runId) => {
  if (!threadId || !runId) {
    throw new Error("Thread ID or Run ID are missing");
  }
  const run = await openai.retrieveRun(threadId, runId);
  return run;
};

/**
 * Retrieves the function call for the "match_mentors" function from the provided "run" object.
 *
 * @param {OpenAI.Beta.Threads.Runs.Run} run - The object containing the required_action and status properties.
 * @returns The function call object for the "match_mentors" function, or undefined if not found.
 */
const getMatchMentorsFunctionCall = (run) => {
  const action = run.required_action;
  if (
    run.status === "requires_action" &&
    action.type === "submit_tool_outputs"
  ) {
    const functionCall = action.submit_tool_outputs.tool_calls.find(
      (toolCall) =>
        toolCall.type === "function" &&
        toolCall.function.name === "match_mentors"
    );
    return functionCall;
  }
};

/**
 * Creates a new thread.
 *
 * @return The newly created thread.
 */
const createNewThread = async () => {
  const thread = await openai.createEmptyThread();
  return thread;
};

/**
 * Submits the mentor match output to openai for processing.
 *
 * @param {Object} options - The options for submitting the mentor match output.
 * @param {string} options.threadId - The ID of the thread.
 * @param {string} options.runId - The ID of the run.
 * @param {string} options.toolCallId - The ID of the tool call.
 * @param {string} options.output - The output to be submitted.
 * @return A promise that resolves to the submitted run.
 */
const submitMentorMatchOutput = async ({
  threadId,
  runId,
  toolCallId,
  output,
}) => {
  const run = await openai.submitToolOutputs({
    threadId,
    runId,
    toolCallId,
    output,
  });
  return run;
};

export {
  addMessageToThreadAndRun,
  retrieveRun,
  getMessagesFromThread,
  submitMentorMatchOutput,
  createNewThread,
  transformOpenAIThreadMessages,
  retrieveOrCreateOpenAIThreadID,
  getMatchMentorsFunctionCall,
};
