/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the grid containing column content
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // 2. Get immediate children of grid (these are columns or column containers)
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // 3. Prepare header row
  const headerRow = ['Columns (columns3)'];

  // 4. Prepare content row: one cell per column, referencing the actual DOM elements
  //    We reference the actual child element for each column, to preserve any structure within.
  const contentRow = columns.map(col => col);

  // 5. Assemble the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace out the old section with our new block table
  element.replaceWith(block);
}
