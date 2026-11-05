export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
      error?: string;
      statusCode?: number;
    };
  };
}
