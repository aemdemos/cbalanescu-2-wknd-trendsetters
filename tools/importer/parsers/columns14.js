/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid containing the columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid (these represent the columns)
  const columns = Array.from(grid.children);

  // Table header, per spec
  const headerRow = ['Columns (columns14)'];
  const cells = [headerRow];

  // Second row: the actual columns
  // Each cell should reference the actual DOM element
  // Defensive: filter empty columns, though in this HTML all have content
  const row = columns.filter(col => col && (col.textContent.trim() || col.querySelector('img,a,p,div,h1,h2,h3,h4,h5,h6')));

  if (row.length) {
    cells.push(row);
  }

  // Only one table needed (no Section Metadata in the markdown example)
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}