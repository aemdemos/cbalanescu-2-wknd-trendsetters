/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);

  // For this layout: leftCol = headings/desc, rightCol = contact list, imgCol = main image
  let leftCol = null;
  let rightCol = null;
  let imgCol = null;

  // Identify which child is which by tag & content
  gridChildren.forEach((child) => {
    if (
      child.tagName === 'DIV' &&
      child.querySelector('h2') &&
      child.querySelector('h3')
    ) {
      leftCol = child;
    } else if (
      child.tagName === 'UL' &&
      child.classList.contains('flex-horizontal')
    ) {
      rightCol = child;
    } else if (child.tagName === 'IMG') {
      imgCol = child;
    }
  });

  // Only make the table if we have the left and right column.
  const headerRow = ['Columns (columns18)'];
  const contentRow = [];
  if (leftCol) contentRow.push(leftCol);
  if (rightCol) contentRow.push(rightCol);

  // Don't proceed if we don't have any column content
  if (contentRow.length === 0) return;

  // Compose the main block table
  const cells = [headerRow, contentRow];
  // Add image as full-width row if present
  if (imgCol) {
    cells.push([imgCol]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
