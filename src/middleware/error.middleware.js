const errorHandler = (err, req, res, next) => {

   const statusCode = err.status || 500;
   if (res.headersSent) {
        return next(err);
    }
   res.status(statusCode).json({
      ok: false,
      message: err.message || "Error interno del servidor"
   });
};

export default errorHandler;
