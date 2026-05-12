/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Hero (hero29)'];

  // Find the grid container
  const grid = element.querySelector('.w-layout-grid');

  // Find the main image (background image)
  let imageCell = '';
  if (grid) {
    // Select the first immediate image child of the grid (not descendant of left column)
    const images = Array.from(grid.children).filter(child => child.tagName === 'IMG');
    if (images.length > 0) {
      imageCell = images[0];
    }
  }

  // Find the text content block (column with all the text and CTA)
  let textContentCell = '';
  if (grid) {
    // Find the first child that's a DIV (not IMG)
    const contentDiv = Array.from(grid.children).find(child => child.tagName === 'DIV');
    if (contentDiv) {
      textContentCell = [contentDiv];
    }
  }

  // Build the cells array as 1 column, 3 rows
  const cells = [
    headerRow,
    [imageCell],
    [textContentCell]
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
