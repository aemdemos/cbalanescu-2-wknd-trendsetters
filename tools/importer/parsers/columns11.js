/* global WebImporter */
export default function parse(element, { document }) {
  // Get top-level container
  const container = element.querySelector('.container');
  if (!container) return;

  // Get main grid (headline/description/author/button)
  const mainGrid = container.querySelector('.w-layout-grid.grid-layout.tablet-1-column.grid-gap-lg');
  const mainCols = mainGrid ? Array.from(mainGrid.children) : [];

  // Defensive: must have 2 columns
  if (mainCols.length < 2) return;

  // Get headline block (left)
  const leftCol = mainCols[0];
  // Get description/author/button block (right)
  const rightCol = mainCols[1];

  // Get image grid (two images, two columns)
  const imageGrid = container.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column.grid-gap-md');
  const imageCols = imageGrid ? Array.from(imageGrid.children) : [];

  // Defensive: expect 2 images
  if (imageCols.length < 2) return;
  const imgCell1 = imageCols[0];
  const imgCell2 = imageCols[1];

  // Compose table rows as per the example markdown:
  // [header], [row1: text/author | text/desc/button], [row2: image | image]
  const cells = [
    ['Columns (columns11)'],
    [leftCol, rightCol],
    [imgCell1, imgCell2]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
