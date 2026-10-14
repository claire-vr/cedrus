/**
 * Minimal CSV parser (RFC 4180): quoted fields, escaped quotes ("") and
 * line breaks inside quotes. Handles the UTF-8 BOM and CRLF line endings
 * that Numbers and Excel add on export.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const input = text.replace(/^\uFEFF/, '');
  const delimiter = detectDelimiter(input);

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * Numbers exports with commas or semicolons depending on the Mac's region
 * settings, so pick whichever appears most often in the first line.
 */
function detectDelimiter(text: string) {
  // A few lines, in case the first one is just a table name.
  const firstLine = text.split(/\r?\n/, 3).join('\n');
  const counts = [',', ';', '\t'].map(
    (d) => [d, firstLine.split(d).length - 1] as const
  );
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? counts[0][0] : ',';
}

/**
 * Turns CSV text into objects keyed by the (lower-cased) header names.
 * The header is the first row that contains all `required` columns, so an
 * extra title line (Numbers' "include table name" option) is skipped.
 * Empty rows are dropped and every value is trimmed.
 */
export function csvRecords(
  text: string,
  required: string[],
  fileName: string
): Record<string, string>[] {
  const rows = parseCsv(text);
  const headerIndex = rows.findIndex((row) => {
    const names = row.map((cell) => cell.trim().toLowerCase());
    return required.every((column) => names.includes(column));
  });
  if (headerIndex === -1) {
    throw new Error(
      `${fileName}: could not find a header row with the columns ${required.join(', ')}`
    );
  }
  const header = rows[headerIndex].map((cell) => cell.trim().toLowerCase());
  return rows
    .slice(headerIndex + 1)
    .filter((row) => row.some((cell) => cell.trim() !== ''))
    .map((row) =>
      Object.fromEntries(
        header.map((name, index) => [name, (row[index] ?? '').trim()])
      )
    );
}
