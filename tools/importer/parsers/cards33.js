/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matches the example
  const headerRow = ['Cards (cards33)'];

  // Each card is an <a>, each row is [image, text content]
  const cardLinks = element.querySelectorAll(':scope > a');
  const rows = Array.from(cardLinks).map((a) => {
    // First column: the image element (reference, not clone)
    const img = a.querySelector('img');

    // Second column: all non-image content from the card
    // Find the div after the image (contains all card text)
    const grid = a.querySelector(':scope > div');
    // Remove the first image from the content, but keep all other elements and text
    // Reference the actual elements, not clones
    // We'll collect all children of grid except the <img>
    const cardContentParts = [];
    Array.from(grid.children).forEach((child) => {
      if (child.tagName !== 'IMG') {
        cardContentParts.push(child);
      }
    });
    // Second column should be an array of elements (preserves all text and structure)
    return [img, cardContentParts];
  });

  // Compose table: header row + all card rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
