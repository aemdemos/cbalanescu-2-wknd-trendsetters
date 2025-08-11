/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match example exactly
  const headerRow = ['Hero (hero20)'];

  // Extract all images in the collage grid (background assets)
  let imagesCell = null;
  const grid = element.querySelector('.grid-layout.desktop-3-column.utility-min-height-100dvh');
  if (grid) {
    const images = Array.from(grid.querySelectorAll('img'));
    if (images.length) {
      // Place all image elements in a single div for the cell
      const collageDiv = document.createElement('div');
      images.forEach(img => collageDiv.appendChild(img));
      imagesCell = collageDiv;
    }
  }

  // Extract headline, subheading, and CTA from content area
  let textContentCell = null;
  const textContainer = element.querySelector(
    '.ix-hero-scale-3x-to-1x-content .container'
  );
  if (textContainer) {
    // Gather h1, p.subheading, and button group in order
    const contentPieces = [];
    const h1 = textContainer.querySelector('h1');
    if (h1) contentPieces.push(h1);
    const subheading = textContainer.querySelector('p.subheading');
    if (subheading) contentPieces.push(subheading);
    const buttons = textContainer.querySelector('.button-group');
    if (buttons) contentPieces.push(buttons);
    // Place all elements in a single div
    const contentDiv = document.createElement('div');
    contentPieces.forEach(el => contentDiv.appendChild(el));
    textContentCell = contentDiv;
  }

  // Build table: 1 column, 3 rows (header, images, text)
  const rows = [
    headerRow,
    [imagesCell],
    [textContentCell]
  ];

  // Create table block and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
