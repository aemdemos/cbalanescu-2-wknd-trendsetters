/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout element containing columns
  const grid = element.querySelector('.w-layout-grid, .grid-layout');
  let columns = [];

  if (grid) {
    columns = Array.from(grid.children);
  } else {
    // Fallback: search for a .container, or use direct children
    const container = element.querySelector('.container');
    if (container) {
      columns = Array.from(container.children);
    } else {
      columns = Array.from(element.children);
    }
  }

  // Remove empty columns (edge-case handling)
  columns = columns.filter(col => col.textContent.trim() !== '' || col.children.length > 0);

  // === CRITICAL FIX ===
  // The header row must contain ONLY ONE CELL, regardless of the number of content columns
  const rows = [];
  rows.push(['Columns (columns3)']); // Single-cell header row
  rows.push(columns); // Second row: each column as a cell

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
