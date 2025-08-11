/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid block for columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Gather all immediate children of the grid as column cells
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;
  // Header row: single column with block name
  const headerRow = ['Columns (columns31)'];
  // Content row: as many columns as needed, each with respective content
  const contentRow = columns;
  // Rows for table
  const cells = [headerRow, contentRow];
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
