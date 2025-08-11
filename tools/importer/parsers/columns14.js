/* global WebImporter */
export default function parse(element, { document }) {
  // The block name header row, single cell as required
  const headerRow = ['Columns (columns14)'];

  // Find the grid containing the columns for the block
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Example HTML is a two-column layout: one column is the heading, one is the paragraph+button
  // We want one row (besides header) with two columns, referencing the direct children of the grid
  // Each child is a column block for this layout
  const columnElements = Array.from(grid.children);

  // If there are fewer than two columns, fill missing columns with an empty string (to keep structure)
  const minColumns = 2;
  while (columnElements.length < minColumns) {
    columnElements.push('');
  }

  // Compose the table
  // No extra rows needed since input HTML only has one visible content row (besides header)
  const cells = [headerRow, columnElements];

  // Create and replace table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
