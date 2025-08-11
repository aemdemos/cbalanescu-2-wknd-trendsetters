/* global WebImporter */
export default function parse(element, { document }) {
  // Required block header
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Collect all direct child divs = possible cards
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  cardDivs.forEach(card => {
    // Find the image (must be present for a card row)
    const img = card.querySelector('img');
    // Find text content (h3 + p) if it exists
    let textContent = null;
    const relDiv = card.querySelector('.utility-position-relative');
    if (relDiv) {
      // Look for content container
      const padDiv = relDiv.querySelector('.utility-padding-all-2rem');
      if (padDiv && padDiv.querySelector('h3') && padDiv.querySelector('p')) {
        textContent = padDiv;
      }
    }
    // Only include rows that have both image and text
    if (img && textContent) {
      rows.push([img, textContent]);
    }
  });

  // Only replace with a table if we have at least one valid card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
  // If no valid cards, do nothing (edge case)
}
