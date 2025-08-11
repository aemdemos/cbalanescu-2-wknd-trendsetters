/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly
  const headerRow = ['Hero (hero35)'];

  // 2. Background image row (optional)
  // In the provided HTML, there is NO background image, so the row should be empty (string)
  const backgroundRow = [''];

  // 3. Content row
  // Get .grid-layout's immediate children
  const gridLayout = element.querySelector('.grid-layout');
  const contentFragments = [];

  if (gridLayout) {
    // First grid cell: headline and subheading
    const firstCol = gridLayout.children[0];
    if (firstCol) {
      // Headline
      const h2 = Array.from(firstCol.children).find(el => el.tagName === 'H2');
      if (h2) contentFragments.push(h2);
      // Subheading
      const subheading = Array.from(firstCol.children).find(el => el.tagName === 'P');
      if (subheading) contentFragments.push(subheading);
    }
    // Second grid cell: CTA button/link
    const secondCol = gridLayout.children[1];
    if (secondCol && secondCol.tagName === 'A') {
      contentFragments.push(secondCol);
    }
  }

  // Assemble cells for createTable
  const cells = [headerRow, backgroundRow, [contentFragments]];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
