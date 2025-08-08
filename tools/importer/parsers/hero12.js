/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always use block name exactly
  const headerRow = ['Hero (hero12)'];

  // Find the grid layout
  const gridDiv = element.querySelector('.grid-layout');
  let bgImg = '';
  let contentCell = '';

  if (gridDiv) {
    // Row 2: Background Image
    const firstCol = gridDiv.children[0];
    if (firstCol) {
      const img = firstCol.querySelector('img.cover-image');
      if (img) {
        bgImg = img;
      }
    }

    // Row 3: Content (Title, features, CTA)
    const secondCol = gridDiv.children[1];
    if (secondCol) {
      // Card body contains all headline, points, and button
      const cardBody = secondCol.querySelector('.card-body');
      if (cardBody) {
        contentCell = cardBody;
      }
    }
  }

  // Build the table
  const cells = [
    headerRow,
    [bgImg],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
