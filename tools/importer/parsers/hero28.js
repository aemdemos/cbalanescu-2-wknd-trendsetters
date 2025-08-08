/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example, exact block name
  const headerRow = ['Hero (hero28)'];

  // Identify main grid layout for content extraction
  const grid = element.querySelector('.w-layout-grid');
  let imageCell = null;
  let textCell = null;
  if (grid) {
    // Get immediate children of grid layout
    const gridChildren = grid.querySelectorAll(':scope > div');
    // Search for the image and the text block
    gridChildren.forEach(child => {
      if (!imageCell && child.querySelector('img')) {
        // Use the image itself as cell content
        imageCell = child.querySelector('img');
      }
      if (!textCell && child.querySelector('h1')) {
        // Use the entire text block as cell content
        textCell = child;
      }
    });
  }
  // Fallback if grid for some reason is not found
  if (!imageCell) {
    imageCell = element.querySelector('img') || '';
  }
  if (!textCell) {
    // Find first h1 and use its parent
    const h1 = element.querySelector('h1');
    if (h1) {
      textCell = h1.parentElement;
    }
  }

  // Table as per example: 1 column, 3 rows (header, image, text)
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}