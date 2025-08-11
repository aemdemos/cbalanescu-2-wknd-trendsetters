/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row
  const headerRow = ['Columns (columns11)'];

  // Get all top-level grids
  const grids = element.querySelectorAll('.w-layout-grid');
  
  // First grid: left: headline/eyebrow; right: paragraph, author, button
  const firstGrid = grids[0];
  let leftCell = null;
  let rightCellContent = [];
  if (firstGrid) {
    const leftCol = firstGrid.children[0];
    const rightCol = firstGrid.children[1];
    if (leftCol) leftCell = leftCol;
    if (rightCol) {
      // Paragraph
      const paragraph = rightCol.querySelector('.rich-text');
      if (paragraph) rightCellContent.push(paragraph);
      // Author row
      const authorRow = rightCol.querySelector('.flex-horizontal.y-center.flex-gap-xs');
      if (authorRow) rightCellContent.push(authorRow);
      // Button (Read more)
      const button = rightCol.querySelector('a.button');
      if (button) rightCellContent.push(button);
    }
  }

  // Second grid: images in 2 columns
  let imgCols = [];
  // Finds the grid with both classes (mobile-portrait-1-column & grid-gap-md)
  const imageGrid = Array.from(grids).find(g => g.classList.contains('mobile-portrait-1-column'));
  if (imageGrid) {
    imgCols = Array.from(imageGrid.children).map(col => {
      const img = col.querySelector('img');
      return img ? img : col;
    });
  }

  // Build table cells - each row is array of cells
  // 1st row: header, 2nd row: 2 columns (headline/eyebrow, all text right col)
  // 3rd row: 2 columns (image, image)
  const cells = [
    headerRow,
    [leftCell, rightCellContent],
    imgCols
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
