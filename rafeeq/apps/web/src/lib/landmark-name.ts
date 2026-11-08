/**
 * Arabic catalogs still use the shared placeholder TODO_AR for unreviewed copy.
 * A page with several named regions then exposes the same accessible name.
 * The English catalog string is already unique, so it is added only in that case.
 * OPEN_QUESTION: reviewed Arabic headings are not in /content. This does not
 * invent an Arabic sentence. It keeps the placeholder and the existing English label.
 */
export function landmarkName(visible: string, english: string): string {
  if (visible === "TODO_AR" && english !== "TODO_AR") {
    return `${visible} (${english})`;
  }
  return visible;
}
