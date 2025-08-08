/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container inside the section
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get the immediate children of the grid (expecting 2: img and content container)
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // Identify which child is the image and which is the content
  let imgCol = null;
  let contentCol = null;
  for (const col of columns) {
    if (col.tagName === 'IMG') {
      imgCol = col;
    } else {
      contentCol = col;
    }
  }
  if (!imgCol || !contentCol) return;

  // Compose the table rows
  const headerRow = ['Columns (columns32)'];
  // Each column is a single cell; reference the full element for maximal coverage
  const contentRow = [imgCol, contentCol];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original section element with the new block
  element.replaceWith(block);
}
