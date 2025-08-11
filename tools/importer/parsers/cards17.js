/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards17) block header
  const headerRow = ['Cards (cards17)'];
  // Get all card containers
  const cardDivs = Array.from(element.querySelectorAll(':scope > div.utility-aspect-1x1'));
  // Each card has an image; no text provided in this HTML, so second column is empty
  const cardRows = cardDivs.map(div => {
    const img = div.querySelector('img');
    // Reference existing img element
    return [img, ''];
  });
  // Compose the table data
  const cells = [headerRow, ...cardRows];
  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
