export function errorHandling(err, req, res, next) {
  try {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    res
      .status(400)
      .status(status)
      .json({
        message: `${message}`,
      });
  } catch (error) {
    next(error);
  }
}
