export function removeLeadingNewline(input: string): string {
  if (input.startsWith('\n')) {
    return input.slice(1);
  }
  return input;
}

export function removeLeadingAndTrailingNewlines(input: string): string {
  return input.replace(/^\n+|\n+$/g, '');
}
