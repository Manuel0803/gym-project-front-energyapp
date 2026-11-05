export class CloudinaryUploadError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'CloudinaryUploadError';
  }
}