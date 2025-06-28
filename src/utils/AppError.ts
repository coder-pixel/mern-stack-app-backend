export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Necessary for extending built-ins like Error
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
