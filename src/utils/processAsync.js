const processAsync = (callback, timeout) => {
  setTimeout(callback, timeout || 2000);
};

export default processAsync;
