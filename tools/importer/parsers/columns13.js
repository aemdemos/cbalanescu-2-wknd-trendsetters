/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate children of the grid (these are the columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, take its direct image (if any), otherwise the whole column
  const cells = columns.map(col => {
    const img = col.querySelector('img');
    return img ? img : col;
  });

  // Compose table rows as per specification: header row is a single cell
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns13)'], // Header row: one column
    cells                    // Second row: as many columns as needed
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
