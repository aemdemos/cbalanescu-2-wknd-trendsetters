/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must have two columns to match the data rows
  const headerRow = ['Cards (cards34)', ''];
  const cardDivs = element.querySelectorAll(':scope > div');
  const rows = [headerRow];
  cardDivs.forEach((cardDiv) => {
    const img = cardDiv.querySelector('img');
    rows.push([img, '']); // image in first column, empty text cell
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
