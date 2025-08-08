/* global WebImporter */
export default function parse(element, { document }) {
  // --- Block table header: matches example exactly
  const headerRow = ['Hero (hero35)'];

  // --- Second row: background image (none present in provided HTML)
  const bgImageRow = [''];

  // --- Third row: Title, Subheading, CTA
  // Find main container holding grid and content
  const container = element.querySelector('.grid-layout');

  let contentCell = [];
  if (container) {
    // The first grid cell contains headings and subheading
    const firstCell = container.children[0];
    // The second grid cell contains button/CTA
    const secondCell = container.children[1];

    // Add all children of first cell (heading, subheading, paragraphs)
    if (firstCell) {
      Array.from(firstCell.children).forEach((child) => {
        contentCell.push(child);
      });
    }
    // Add CTA (link/button) if present
    if (secondCell) {
      contentCell.push(secondCell);
    }
  } else {
    // Fallback: place all element children if grid not found
    contentCell = Array.from(element.children);
  }

  // The table requires 1 column, 3 rows: header, bg image, content
  const cells = [
    headerRow,
    bgImageRow,
    [contentCell],
  ];

  // Create table using WebImporter helper
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with new table
  element.replaceWith(table);
}
