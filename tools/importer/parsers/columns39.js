/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all immediate children (the columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (!columns.length) {
    element.remove();
    return;
  }
  // For each column, extract the content to display (prefer image if only an image, else whole div)
  const columnCells = columns.map((col) => {
    if (
      col.children.length === 1 &&
      col.firstElementChild.tagName.toLowerCase() === 'img'
    ) {
      return col.firstElementChild;
    }
    return col;
  });

  // Table header must be a single cell row
  const headerRow = ['Columns (columns39)'];
  const cells = [headerRow, columnCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
