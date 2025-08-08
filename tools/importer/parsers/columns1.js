/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout holding the columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get the immediate children of the grid (these are the columns)
  const children = Array.from(grid.children);
  if (children.length < 2) return; // Expect at least 2 columns

  // Table header row as specified
  const headerRow = ['Columns (columns1)'];
  // Content row: one cell per column
  const contentRow = children;

  // Create the columns block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the block
  element.replaceWith(block);
}
