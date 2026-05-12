/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that contains the two columns
  const mainGrid = element.querySelector('.grid-layout');
  if (!mainGrid) return;
  const gridChildren = Array.from(mainGrid.children);
  // Heuristic: the left column is the div with heading, the right is the image
  let leftCol = null;
  let rightCol = null;
  for (const child of gridChildren) {
    if (!leftCol && child.querySelector && child.querySelector('h1')) {
      leftCol = child;
    }
    if (!rightCol && child.tagName === 'IMG') {
      rightCol = child;
    }
  }
  // Fallbacks if structure changes
  if (!leftCol) leftCol = gridChildren.find((el) => el.tagName !== 'IMG');
  if (!rightCol) rightCol = gridChildren.find((el) => el.tagName === 'IMG');

  // For content, use the whole left column block and image element directly
  // This ensures all child text (h1, p, buttons, etc.) are included
  const header = ['Columns (columns42)'];
  const row = [leftCol, rightCol];
  const cells = [header, row];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
