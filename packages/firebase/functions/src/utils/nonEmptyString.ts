export const nonEmptyString = (value: unknown): string => {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  throw new Error(`value must be non empty string. ${value}`);
};
