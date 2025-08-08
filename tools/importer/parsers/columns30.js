/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // The header row must be a single cell
  const headerRow = ['Columns (columns30)'];
  // The second row contains all columns as individual cells
  const contentRow = columns;

  // Assemble the table: header row (single cell), then content row (multiple cells)
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
