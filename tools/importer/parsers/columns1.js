/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name
  const headerRow = ['Columns (columns1)'];

  // Find the grid layout with two columns (image, content)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // The children are the columns; ensure we only select direct children
  const columns = Array.from(grid.children);

  // We expect one image and one content block
  let imgCol = null;
  let contentCol = null;

  // Find the image column (IMG element)
  imgCol = columns.find(child => child.tagName === 'IMG');
  // The other column (DIV with heading, subheading, buttons)
  contentCol = columns.find(child => child !== imgCol);

  // Only include columns if present
  const cellsRow = [];
  if (imgCol) cellsRow.push(imgCol);
  if (contentCol) cellsRow.push(contentCol);
  if (cellsRow.length === 0) return;

  // Table structure: header row, then one row with two columns
  const cells = [headerRow, cellsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
