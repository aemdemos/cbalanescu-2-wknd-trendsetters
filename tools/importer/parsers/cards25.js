/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Get all immediate children (the cards)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  cardDivs.forEach(cardDiv => {
    // Find the image (always present for each card)
    const img = cardDiv.querySelector('img');
    // Find the card text content
    let textContent = '';
    const textWrapper = cardDiv.querySelector('.utility-padding-all-2rem');
    if (textWrapper) {
      // Compose an array of elements for the text cell
      const textElements = [];
      // Find heading (if present)
      const h3 = textWrapper.querySelector('h3');
      if (h3) textElements.push(h3);
      // Find paragraph (if present)
      const p = textWrapper.querySelector('p');
      if (p) textElements.push(p);
      textContent = textElements;
    } else {
      // No text, use empty string
      textContent = '';
    }
    if (img) {
      rows.push([img, textContent]);
    }
  });

  // Create table and replace the original block
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
