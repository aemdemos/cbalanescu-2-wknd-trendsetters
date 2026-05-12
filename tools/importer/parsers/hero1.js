/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function findChildByClass(parent, className) {
    for (const child of parent.children) {
      if (child.classList && child.classList.contains(className)) {
        return child;
      }
    }
    return null;
  }

  // Header row
  const headerRow = ['Hero (hero1)'];

  // Get the main .container div
  const container = findChildByClass(element, 'container') || element;

  // Find grid-layout (main content container)
  const grid = container.querySelector('.grid-layout') || container;

  // Find the main image (background image cell)
  let img = null;
  for (const child of grid.children) {
    if (child.tagName === 'IMG') {
      img = child;
      break;
    }
  }

  // Find the text block (usually the non-img direct child)
  let textBlock = null;
  for (const child of grid.children) {
    if (child !== img && child.nodeType === 1) {
      textBlock = child;
      break;
    }
  }

  // Fallbacks for missing image or textBlock
  // If image is missing, leave cell empty
  // If textBlock is missing, leave cell empty

  const cells = [
    headerRow,
    [img ? img : ''],
    [textBlock ? textBlock : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
