/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block, as required
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];
  // Select all immediate child divs (cards)
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  cards.forEach((card) => {
    // 1st cell: the image (mandatory for every card)
    const img = card.querySelector('img');
    // 2nd cell: text content (optional, might not exist)
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p');
    const cellContent = [];
    if (h3) cellContent.push(h3);
    if (p) cellContent.push(p);
    // If no h3 or p, keep cell empty string to preserve 2-column structure
    rows.push([
      img, // reference the existing img element (or null if not found, which is okay)
      cellContent.length ? cellContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
