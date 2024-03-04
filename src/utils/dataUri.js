// a function to convert file buffer to data uri
const bufferToDataUri = (file) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  return `data:${file.mimetype};base64,${b64}`;
};

export { bufferToDataUri };
