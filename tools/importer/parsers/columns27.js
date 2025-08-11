/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Columns (columns27)'];

  // Find grid layout structure
  let grid = null;
  const container = element.querySelector('.container');
  if (container) {
    grid = container.querySelector('.grid-layout');
  }
  if (!grid) {
    grid = element.querySelector('.grid-layout');
  }

  // Get immediate children of the grid (left content DIV, right IMG)
  let leftCol = null;
  let rightCol = null;
  if (grid) {
    const children = Array.from(grid.children);
    // Pick first div and first img as left and right content
    leftCol = children.find(e => e.tagName === 'DIV');
    rightCol = children.find(e => e.tagName === 'IMG');
  }
  // Defensive: fallback to first div/img in container
  if (!leftCol && container) {
    leftCol = container.querySelector('div');
  }
  if (!rightCol && container) {
    rightCol = container.querySelector('img');
  }

  // For left column, collect all block-level content in order,
  // preserving heading, paragraphs, and button
  let leftColContent = [];
  if (leftCol) {
    leftColContent = Array.from(leftCol.childNodes).filter(
      node => {
        // Filter out empty text nodes
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      }
    );
  }

  // For right column, just keep the image as is
  let rightColContent = [];
  if (rightCol) {
    rightColContent = [rightCol];
  }

  // Compose the table row with both columns as in example
  const cells = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
