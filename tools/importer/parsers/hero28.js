/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Hero (hero28)'];

  // Get top-level grid container
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get all direct children of grid (should be 2)
  const gridChildren = Array.from(grid.children);

  // Find the background image (first grid cell)
  let imageCell = null;
  if (gridChildren[0]) {
    const img = gridChildren[0].querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Find the content cell (second grid cell)
  let contentCell = null;
  if (gridChildren[1]) {
    // The content cell should contain title/subheading/button
    // We'll use the entire child block for resilience
    contentCell = gridChildren[1];
  }

  // Compose table rows, include cells even if missing for consistent structure
  const rows = [
    headerRow,
    [imageCell || ''],
    [contentCell || '']
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(blockTable);
}
