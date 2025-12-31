export function escapeCsvValue(value: string | number): string {
  const str: string = String(value);

  const hasSpecialChars: boolean =
    str.includes(",") || str.includes('"') || str.includes("'") || str.includes("\n");

  if (!hasSpecialChars) {
    return str;
  }

  const escaped: string = str.replace(/"/g, '""');
  return `"${escaped}"`;
}
