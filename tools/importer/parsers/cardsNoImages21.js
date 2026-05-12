/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example exactly
  const cells = [['Cards']];
  // Select all direct child card divs
  const cardDivs = Array.from(element.querySelectorAll(':scope > div.flex-horizontal'));
  cardDivs.forEach((cardDiv) => {
    // Get the card body paragraph
    const desc = cardDiv.querySelector('p');
    // Only add if description element exists
    if (desc) {
      cells.push([desc]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
