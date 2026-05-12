/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content grid (two column)
  const mainGrid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  if (!mainGrid) return;
  const mainCols = mainGrid.querySelectorAll(':scope > div');
  if (mainCols.length < 2) return;

  // Get left column (headline)
  const leftCol = mainCols[0];
  // Get right column (intro, meta, button)
  const rightCol = mainCols[1];

  // Get the image grid below (the big square images)
  const imageGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column');
  let img1 = '';
  let img2 = '';
  if (imageGrid) {
    const imgs = imageGrid.querySelectorAll('img');
    img1 = imgs[0] || '';
    img2 = imgs[1] || '';
  }

  // Build the cells array with a SINGLE-CELL header row
  const cells = [
    ['Columns (columns41)'], // single column header row
    [leftCol, rightCol],     // two content columns
    [img1, img2]             // two images
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
