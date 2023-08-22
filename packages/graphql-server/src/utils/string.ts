export function removeLeadingNewline(input: string): string {
 if (input.startsWith('\n')) {
  return input.slice(1);
 }
 return input;
}