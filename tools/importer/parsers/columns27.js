/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get direct children: left (text/button) and right (image) columns
  const columns = Array.from(grid.children);

  // Defensive: ensure at least two columns for a columns block
  if (columns.length < 2) return;

  // Table header must match the example
  const headerRow = ['Columns (columns27)'];

  // Table row: each column directly as a cell (reference the element itself)
  const contentRow = columns;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original section with the columns block table
  element.replaceWith(table);
}
