/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children (columns) of the grid
  const columns = Array.from(grid.children);

  // Create the table header row with a single cell
  const headerRow = ['Columns (columns9)'];

  // Create a single table row with all columns in that row (the columns block requires one row for all columns)
  const contentRow = [columns];
  
  // Assemble the table structure
  const cells = [headerRow, contentRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
