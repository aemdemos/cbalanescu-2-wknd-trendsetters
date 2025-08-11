/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the requirements
  const headerRow = ['Columns (columns32)'];

  // Find the grid container that holds the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get all immediate children of the grid (the columns)
  const columns = Array.from(grid.children);

  // In the provided HTML, the first column is the image, the second column is the content (div)
  // We want to reference the actual elements, not their HTML
  const imgCol = columns.find((col) => col.tagName === 'IMG');
  const contentCol = columns.find((col) => col !== imgCol);

  // Defensive: handle missing columns
  if (!imgCol || !contentCol) return;

  // Each cell in the second row matches a column in the block
  const row = [imgCol, contentCol];

  // Compose the block table
  const cells = [headerRow, row];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
