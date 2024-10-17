class ApiError extends Error {
  messageCode: string;
  statusCode: number;
  stack: string | undefined;
  constructor(
    statusCode: number,
    message: string | undefined,
    messageCode: string = "",
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.messageCode = messageCode ?? "UNDEFINED_ERROR";
    Error.captureStackTrace(this, this.constructor);
  }
}
export default ApiError;
