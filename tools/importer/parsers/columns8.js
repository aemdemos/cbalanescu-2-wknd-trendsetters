/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner grid element that contains the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get all direct children of the grid as columns
  const cols = Array.from(grid.children);
  // Remove columns that are empty (for robustness)
  const validCols = cols.filter(col => col && (col.textContent.trim() || col.querySelector('img,video,a,iframe')));
  // Create header row with a single cell
  const headerRow = ['Columns (columns8)'];
  // Create content row with one cell for each column
  const contentRow = validCols;
  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  // Set colspan on the header cell so it visually spans all columns
  const th = table.querySelector('th');
  if (th && validCols.length > 1) {
    th.setAttribute('colspan', validCols.length);
  }
  // Replace the original element with the block table
  element.replaceWith(table);
}
