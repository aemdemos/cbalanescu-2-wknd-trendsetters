/* global WebImporter */
export default function parse(element, { document }) {
  // Grab the two direct .w-layout-grid > div children
  const grid = element.querySelector('.w-layout-grid');
  const gridDivs = grid ? grid.querySelectorAll(':scope > div') : [];

  // 1. Background image: first img in the left grid cell
  let bgImgEl = null;
  if (gridDivs.length > 0) {
    bgImgEl = gridDivs[0].querySelector('img');
  }
  // If no background image, leave cell blank

  // 2. Content cell (headline, features, CTA, and possibly a foreground image)
  // The card is inside the right div
  let contentCellEls = [];
  if (gridDivs.length > 1) {
    const card = gridDivs[1].querySelector('.card');
    if (card) {
      // We want all card content, including images inside
      contentCellEls.push(card);
    } else {
      // fallback: use the whole right grid cell
      contentCellEls.push(gridDivs[1]);
    }
  } else {
    contentCellEls = [];
  }

  // Build the table for Hero (hero14)
  const cells = [
    ['Hero (hero14)'],
    [bgImgEl ? bgImgEl : ''],
    [contentCellEls.length === 1 ? contentCellEls[0] : contentCellEls]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
