/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as given
  const headerRow = ['Cards (cards7)'];

  // Each direct child div is a card container
  const cardDivs = element.querySelectorAll(':scope > div');

  // For each card div, find the image inside
  const rows = Array.from(cardDivs).map(cardDiv => {
    // Find the first image in this card div
    const img = cardDiv.querySelector('img');
    // Always reference the existing image, not a clone
    // No text in this HTML, so text cell is blank string
    return [img, ''];
  });

  // Compose the table array: header + card rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
