export type HealthResponse = {
  success: boolean;
  message: string;
  service: "azure-functions";
};

export type ApiErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};
