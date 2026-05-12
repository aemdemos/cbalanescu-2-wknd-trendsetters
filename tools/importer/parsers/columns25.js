/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns grid wrapper inside the footer (should always exist)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid, which are columns (could be div or ul)
  const columns = Array.from(grid.children);

  // For each column, wrap its content in a div (to preserve structure and direct reference)
  // Reference content directly from the DOM, do not clone.
  // If column is empty, create an empty div
  const columnDivs = columns.map((col) => {
    const wrapper = document.createElement('div');
    while (col.firstChild) {
      wrapper.appendChild(col.firstChild);
    }
    return wrapper;
  });

  // The header row must contain exactly one cell (string matching the block name)
  const headerRow = ['Columns (columns25)'];
  // The content row contains one cell for each column
  const contentRow = columnDivs;

  // Build the table as per requirements: one single-cell header row, one multi-cell content row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
