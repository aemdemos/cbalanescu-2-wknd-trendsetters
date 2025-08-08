/* global WebImporter */
export default function parse(element, { document }) {
  // The main grid containing two columns: left (content), right (image)
  const topLevelGrid = element.querySelector('.grid-layout');
  if (!topLevelGrid) return;

  // Get all immediate children (should be two: inner grid and img)
  const children = Array.from(topLevelGrid.children);

  // Find the left content grid (contains heading, paragraph, buttons)
  let leftCell = null;
  // The left column is a div.grid-layout (container), and inside, another div.section (actual content)
  for (const child of children) {
    if (child.tagName === 'DIV' && child.classList.contains('grid-layout')) {
      // Find the actual content section inside
      const contentSection = child.querySelector('.section');
      leftCell = contentSection ? contentSection : child;
      break;
    }
  }

  // Find the right column, which is the image
  let rightCell = null;
  for (const child of children) {
    if (child.tagName === 'IMG') {
      rightCell = child;
      break;
    }
  }

  // Fallback: If extraction fails, use null for missing cell
  const headerRow = ['Columns (columns5)'];
  const cells = [headerRow, [leftCell, rightCell]];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
