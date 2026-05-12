/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const gridCols = Array.from(grid.children);
  // Defensive: Expecting at least 3 columns: left (intro), middle (contacts), right (image)
  if (gridCols.length < 3) return;

  // Left: heading/intro (h2, h3, p)
  const leftCol = gridCols[0];
  // Middle: contact methods
  const middleCol = gridCols[1];
  // Right: image
  const rightCol = gridCols[2];

  // Compose first cell: leftCol + middleCol
  const firstCell = document.createElement('div');
  Array.from(leftCol.childNodes).forEach((node) => firstCell.appendChild(node));
  firstCell.appendChild(middleCol);

  // Second cell: rightCol is just the image
  const secondCell = rightCol;

  // Header row: exactly one column/cell, matching requirements
  const headerRow = ['Columns (columns20)'];
  // Content row: two columns
  const contentRow = [firstCell, secondCell];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
