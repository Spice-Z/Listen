type SemVer = string;

/**
 * Compare two semver strings.
 * @param v1
 * @param v2
 * @returns 1 if v1 > v2, -1 if v1 < v2, 0 if v1 === v2
 */
export function compareSemVer(v1: SemVer, v2: SemVer): number {
  const parseVersion = (v: string) => v.split('-')[0].split('.').map(Number);
  const [major1, minor1, patch1] = parseVersion(v1);
  const [major2, minor2, patch2] = parseVersion(v2);

  if (major1 > major2) return 1;
  if (major1 < major2) return -1;

  if (minor1 > minor2) return 1;
  if (minor1 < minor2) return -1;

  if (patch1 > patch2) return 1;
  if (patch1 < patch2) return -1;

  return 0;
}
