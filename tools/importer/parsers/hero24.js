/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first tab pane (the first hero variant)
  const firstTab = element.querySelector('.w-tab-pane');
  let grid = null;
  if (firstTab) {
    // Get the main grid block containing all hero content
    grid = firstTab.querySelector('.w-layout-grid, .grid-layout');
  }

  // Fallback if grid is not found
  const contentContainer = grid || firstTab || element;

  // Get all children except for images (for text row), and gather images for image row
  const children = Array.from(contentContainer.children);
  const images = children.filter(child => child.tagName === 'IMG');
  const textNodes = children.filter(child => child.tagName !== 'IMG');

  // If textNodes is empty, use blank string
  let textContent;
  if (textNodes.length === 1) {
    textContent = textNodes[0];
  } else if (textNodes.length > 1) {
    textContent = textNodes;
  } else {
    textContent = '';
  }

  // If images is empty, use blank string
  let imageContent;
  if (images.length === 1) {
    imageContent = images[0];
  } else if (images.length > 1) {
    imageContent = images;
  } else {
    imageContent = '';
  }

  // Build the table rows
  const rows = [];
  rows.push(['Hero (hero24)']);
  rows.push([imageContent]);
  rows.push([textContent]);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
