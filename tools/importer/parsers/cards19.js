/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards19)'];
  const cardDivs = element.querySelectorAll(':scope > div');
  const rows = [];
  cardDivs.forEach(card => {
    // Get icon (as existing element, not cloned)
    let iconCell = null;
    const iconCol = card.querySelector(':scope > div');
    if (iconCol) {
      const iconSvg = iconCol.querySelector('svg');
      if (iconSvg) {
        // Move the SVG node out of the iconCol for direct reference
        iconCell = iconSvg;
      } else {
        iconCell = iconCol;
      }
    }
    // Get the text content (as existing paragraph)
    const textCol = card.querySelector('p');
    rows.push([iconCell, textCol]);
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
