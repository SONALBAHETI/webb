import OpenAI from "openai";
import config from "../../config/config.js";

const openai = new OpenAI({
  apiKey: config.openAI.apiKey,
});

/**
 * Creates a completion using the specified model.
 *
 * @param {Object} model - The model to use for creating the completion.
 * @return {Promise<string>} The completed message content.
 */
const createCompletion = async (model) => {
  const response = await openai.chat.completions.create(model);
  return response.choices[0]?.message?.content;
};

/**
 * Creates an assistant using the specified model.
 *
 * @param {string} model - The model to be used for the assistant.
 * @return A promise that resolves to the response from creating the assistant.
 */
const createAssistant = async (model) => {
  const response = await openai.beta.assistants.create(model);
  return response;
};

/**
 * Retrieves an assistant using the provided assistant ID.
 *
 * @param {string} assistantId - The ID of the assistant to retrieve.
 * @return A promise that resolves to the retrieved assistant.
 */
const retrieveAssistant = async (assistantId) => {
  const response = await openai.beta.assistants.retrieve(assistantId);
  return response;
};

/**
 * Creates an empty thread.
 *
 * @return The created empty thread.
 */
const createEmptyThread = async () => {
  const emptyThread = await openai.beta.threads.create();
  return emptyThread;
};

/**
 * Creates a new thread with default message(s)
 * @param {Array<{role: string, content: string}>} messages - Array of messages to be added.
 * @return The created thread.
 */
const createNewThreadWithMessages = async (messages) => {
  const emptyThread = await openai.beta.threads.create({ messages });
  return emptyThread;
};

/**
 * Retrieves a thread using the provided thread ID.
 *
 * @param {string} threadID - The ID of the thread to retrieve.
 * @return A Promise that resolves to the retrieved thread.
 */
const retrieveThread = async (threadID) => {
  const myThread = await openai.beta.threads.retrieve(threadID);
  return myThread;
};

/**
 * Adds a message to a thread.
 *
 * @param {string} threadID - The ID of the thread.
 * @param {string} message - The message to be added.
 * @return The thread messages.
 */
const addMessageToThread = async (threadID, message) => {
  const threadMessages = await openai.beta.threads.messages.create(threadID, {
    role: "user",
    content: message,
  });
  return threadMessages;
};

/**
 * Retrieves messages from a thread
 * @param {string} threadID - The ID of the thread to retrieve messages from
 * @returns A promise that resolves with the messages from the thread
 */
const retrieveMessagesFromThread = async (threadID) => {
  // Retrieve messages from the specified thread
  const threadMessages = await openai.beta.threads.messages.list(threadID);
  return threadMessages;
};

/**
 * Creates a run for a given thread ID and assistant ID.
 *
 * @param {string} threadID - The ID of the thread.
 * @param {string} assistantID - The ID of the assistant.
 * @return The created run object.
 */
const createRun = async (threadID, assistantID) => {
  const run = await openai.beta.threads.runs.create(threadID, {
    assistant_id: assistantID,
  });
  return run;
};

/**
 * Retrieves a specific run from a thread in the OpenAI beta API.
 *
 * @param {string} threadID - The ID of the thread containing the run.
 * @param {string} runID - The ID of the run to retrieve.
 * @return The retrieved run object.
 */
const retrieveRun = async (threadID, runID) => {
  const run = await openai.beta.threads.runs.retrieve(threadID, runID);
  return run;
};

/**
 * Submits tool outputs for a given thread, run, tool call ID, and output.
 *
 * @param {Object} options - The options for submitting tool outputs.
 * @param {string} options.threadId - The ID of the thread.
 * @param {string} options.runId - The ID of the run.
 * @param {string} options.toolCallId - The ID of the tool call.
 * @param {string} options.output - The output to submit.
 * @returns A promise that resolves with the submitted run.
 */
const submitToolOutputs = async ({ threadId, runId, toolCallId, output }) => {
  const run = await openai.beta.threads.runs.submitToolOutputs(
    threadId,
    runId,
    {
      tool_outputs: [
        {
          tool_call_id: toolCallId,
          output,
        },
      ],
    }
  );

  return run;
};

export {
  createCompletion,
  createAssistant,
  retrieveAssistant,
  createEmptyThread,
  createNewThreadWithMessages,
  addMessageToThread,
  createRun,
  retrieveRun,
  submitToolOutputs,
  retrieveThread,
  retrieveMessagesFromThread,
};
