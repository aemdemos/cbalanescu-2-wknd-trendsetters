/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per block guidelines
  const headerRow = ['Cards (cards11)'];
  // Find all direct child card links
  const cards = Array.from(element.querySelectorAll(':scope > a.card-link'));
  const cells = [headerRow];

  cards.forEach(card => {
    // First cell: the card image (element, not cloned)
    let imageCell = null;
    const aspect = card.querySelector('.utility-aspect-3x2');
    if (aspect) {
      const img = aspect.querySelector('img');
      if (img) imageCell = img;
    }
    // Second cell: text content (reference the text wrapper)
    let textCell = null;
    const textWrap = card.querySelector('.utility-padding-all-1rem');
    if (textWrap) textCell = textWrap;
    // Only push if both parts present (should always be true in real data)
    if (imageCell || textCell) {
      cells.push([imageCell, textCell]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
