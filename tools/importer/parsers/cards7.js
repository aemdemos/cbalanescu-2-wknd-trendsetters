/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per instructions
  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];
  // Each card is a child div with an aspect ratio class
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach(cardDiv => {
    // Find image in each card div
    const img = cardDiv.querySelector('img');
    // For this HTML, there's no text content, but keep structure
    rows.push([img, '']);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
