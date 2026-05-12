/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container
  const container = element.querySelector('.container');
  if (!container) return;
  const outerGrid = container.querySelector('.w-layout-grid.grid-layout');
  if (!outerGrid) return;

  // --- First row, left cell: heading and quote ---
  const heading = outerGrid.querySelector('p.h2-heading');
  const quote = outerGrid.querySelector('p.paragraph-lg');
  const leftTop = document.createElement('div');
  if (heading) leftTop.appendChild(heading);
  if (quote) leftTop.appendChild(quote);

  // --- First row, right cell: intentionally blank ---
  const rightTop = '';

  // --- Second row: testimonial and logo ---
  let leftBottom = '';
  let rightBottom = '';
  // The testimonial and logo are inside the nested grid
  const innerGrid = outerGrid.querySelector('.w-layout-grid.grid-layout.grid-gap-sm');
  if (innerGrid) {
    const divider = innerGrid.querySelector('.divider');
    const testimonial = innerGrid.querySelector('.flex-horizontal');
    const leftDiv = document.createElement('div');
    if (divider) leftDiv.appendChild(divider);
    if (testimonial) leftDiv.appendChild(testimonial);
    if (leftDiv.childNodes.length > 0) leftBottom = leftDiv;
    const logo = innerGrid.querySelector('.utility-display-inline-block');
    if (logo) rightBottom = logo;
  }
  
  // Compose cells as a table: header, then 2x2 grid
  const cells = [
    ['Columns (columns28)'],
    [leftTop, rightTop],
    [leftBottom, rightBottom]
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
