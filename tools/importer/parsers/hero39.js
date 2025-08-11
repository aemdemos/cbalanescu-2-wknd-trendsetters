/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block name - matches the example exactly
  const headerRow = ['Hero (hero39)'];

  // Find background image (first <img> in block)
  const bgImg = element.querySelector('img');

  // Find the main text column (typically the second div in grid)
  // The grid structure: <div class="w-layout-grid grid-layout"> has 2 children
  // First child is image/overlay, second is content
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  let textCol = null;
  if (grid) {
    const children = grid.children;
    // Defensive: check there are at least two children
    if (children.length > 1) {
      textCol = children[1];
    } else if (children.length === 1) {
      textCol = children[0];
    }
  }

  // From the content column, get all relevant content for block (headings, paragraph, button)
  let contentCell = null;
  if (textCol) {
    // Sometimes there's an extra grid inside, so let's try to get the deepest direct text container
    // In the example HTML: <div class="w-layout-grid grid-layout tablet-1-column grid-gap-lg y-bottom">
    const innerGrid = textCol.querySelector('.w-layout-grid.grid-layout');
    contentCell = innerGrid || textCol;
  }

  // Edge case: if there's no content cell, use an empty div (maintain table row count)
  if (!contentCell) {
    contentCell = document.createElement('div');
  }

  // Edge case: if there's no image, use empty cell
  const imgCell = bgImg || document.createElement('div');

  // Compose the table
  const cells = [
    headerRow,
    [imgCell],
    [contentCell],
  ];

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
