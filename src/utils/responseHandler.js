// utility function to catch async errors and calling next(), to be used as a middleware
const responseHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .then(() => next())
    .catch((err) => next(err));
};

export default responseHandler;
