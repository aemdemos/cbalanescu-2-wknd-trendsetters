/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout that holds the main columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get all immediate children of the grid layout
  const columns = Array.from(grid.children);

  // If there are less than 2 columns, skip
  if (columns.length < 2) return;

  // Column 1: should contain text and buttons; Column 2: image
  // For robustness, gather all non-img for left, all img for right
  const leftCellContent = [];
  const rightCellContent = [];
  columns.forEach((col) => {
    if (col.tagName === 'IMG') {
      rightCellContent.push(col);
    } else {
      // Check inside for images (in case images are nested)
      const nestedImgs = Array.from(col.querySelectorAll('img'));
      if (nestedImgs.length > 0 && col.childNodes.length === 1 && col.childNodes[0].tagName === 'IMG') {
        rightCellContent.push(...nestedImgs);
      } else {
        leftCellContent.push(col);
      }
    }
  });

  // Fallback in case nothing in left or right
  const leftCell = leftCellContent.length ? leftCellContent : [''];
  const rightCell = rightCellContent.length ? rightCellContent : [''];

  // Build the columns block table as per example
  const cells = [
    ['Columns (columns15)'],
    [leftCell, rightCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
