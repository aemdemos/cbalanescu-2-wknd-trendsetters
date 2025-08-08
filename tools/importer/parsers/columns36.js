/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name
  const headerRow = ['Columns (columns36)'];

  // Find the main grid for columns
  const mainGrid = element.querySelector('.w-layout-grid.grid-layout');
  if (!mainGrid) return;

  // Get direct children of the main grid (assume two columns: left, right)
  const columns = Array.from(mainGrid.children);
  if (columns.length < 2) return;

  // LEFT COLUMN: Structured content (h1, subheading, button group)
  const leftCol = columns[0];
  // We'll collect all direct children relevant (h1, p, div.button-group)
  const leftCellContent = [];
  const h1 = leftCol.querySelector('h1');
  if (h1) leftCellContent.push(h1);
  const subheading = leftCol.querySelector('p.subheading');
  if (subheading) leftCellContent.push(subheading);
  const buttonGroup = leftCol.querySelector('.button-group');
  if (buttonGroup) leftCellContent.push(buttonGroup);

  // RIGHT COLUMN: Image grid
  const rightCol = columns[1];
  // Find the nested image grid
  const imgGrid = rightCol.querySelector('.w-layout-grid');
  let rightCellContent = [];
  if (imgGrid) {
    // Collect each image reference in order
    rightCellContent = Array.from(imgGrid.querySelectorAll('img'));
  }

  // Build the table cells (header, then 2 columns)
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create the block and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
