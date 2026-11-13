
export class AppError extends Error {
  constructor(
    message: string,
    public status: number,
    public codigo: string
  ) {
    super(message);
    this.name = "AppError";
  }
}
