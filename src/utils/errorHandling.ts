export const parseErrorMessage = (value: unknown, fallback: string) => {
  if (value instanceof Error && value.message.trim().length > 0) {
    return value.message;
  }
  return fallback;
};
