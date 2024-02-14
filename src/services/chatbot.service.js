import config from "../config/config.js";
import * as openai from "../providers/openai/api.js";
import { Document } from "mongoose";
import User from "../models/user.model.js";
import OpenAI from "openai";
import { updateOpenAIThreadId } from "./user.service.js";
import { createUserMatch, matchMentors } from "../algorithm/matchmaking.js";

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
 * @param {string} [limit=20] - A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.
 * @returns Resolves with the messages from the thread with pagination
 */
const getMessagesFromThread = async (threadID, limit = 20) => {
  const threadMessagesPage = await openai.retrieveMessagesFromThread(
    threadID,
    limit
  );
  return threadMessagesPage;
};

/**
 * Retrieves the last message from the specified thread.
 *
 * @param {string} threadID - The ID of the thread to retrieve the last message from.
 * @return The last message from the specified thread.
 */
const getLastMessageFromThread = async (threadID) => {
  const threadMessagesPage = await getMessagesFromThread(threadID, 1);
  return threadMessagesPage.data[0];
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
    metadata: m.metadata,
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
 * Retrieves the steps of a specific run from a thread in the OpenAI beta API.
 *
 * @param {string} threadID - The ID of the thread containing the run.
 * @param {string} runID - The ID of the run to retrieve.
 * @return The retrieved run steps object.
 */
const listRunSteps = async (threadID, runID) => {
  const runSteps = await openai.listRunSteps(threadID, runID);
  return runSteps;
};

/**
 * Add metadata to a message.
 *
 * @param {string} threadID - The ID of the message thread
 * @param {string} messageID - The ID of the message
 * @param {object} metadata - The metadata to add to the message
 * @return The updated message with added metadata
 */
const addMetadataToMessage = async (threadID, messageID, metadata) => {
  const updatedMessage = await openai.modifyMessage(
    threadID,
    messageID,
    metadata
  );
  return updatedMessage;
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
 * Get arguments from a function call.
 *
 * @param {Object} functionCall - the function call to parse
 * @return parsed arguments from the function call
 */
const getArgumentsFromFunctionCall = (functionCall) => {
  return JSON.parse(functionCall.function.arguments);
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

/**
 * Handles the openai function call to match mentors and
 * creates a user match, adds metadata to the last message, and submits mentor match output.
 * Returns the run object after submission
 *
 * @param {Object} functionCall - The function call object
 * @param {string} requesterId - The id of the requester
 * @param {string} threadId - The id of the thread
 * @param {string} runId - The id of the run
 * @return The submitted run object
 */
const handleMatchMentorsFunctionCall = async (
  functionCall,
  requesterId,
  threadId,
  runId
) => {
  const output = {};
  // match mentors based on function call parameters
  const matchedMentors = await matchMentors(
    getArgumentsFromFunctionCall(functionCall)
  );
  if (matchedMentors.length) {
    // create a UserMatch document with all the matched mentors along with the requester ID
    const userMatch = await createUserMatch(requesterId, matchedMentors);
    // get last message from the thread
    const lastMessage = await getLastMessageFromThread(threadId);
    // add the UserMatch document reference to the last message (to display matched mentors)
    await addMetadataToMessage(threadId, lastMessage.id, {
      userMatchId: userMatch.id,
    });
    output.success = true;
  } else {
    output.success = false;
  }
  output.numOfMentorsMatched = matchedMentors.length;
  // submit the match result to the openai assistant and return the run object
  const run = await submitMentorMatchOutput({
    threadId,
    runId,
    toolCallId: functionCall.id,
    output: JSON.stringify(output),
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
  listRunSteps,
  getLastMessageFromThread,
  addMetadataToMessage,
  getArgumentsFromFunctionCall,
  handleMatchMentorsFunctionCall,
};
