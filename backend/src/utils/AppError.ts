class AppError extends Error {
  statusCode: number;
  code: string | null;
  isOperational: boolean;

  constructor(message: string, statusCode: number, code: string | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
