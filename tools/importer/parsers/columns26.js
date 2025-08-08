/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly
  const headerRow = ['Columns (columns26)'];

  // Find main container, grid, and inner grid for column split
  const container = element.querySelector('.container');
  let grid = null;
  if (container) {
    grid = container.querySelector('.w-layout-grid.grid-layout');
  }
  if (!grid) {
    grid = element.querySelector('.w-layout-grid.grid-layout');
  }
  // Inner grid contains the split left/right content
  let innerGrid = null;
  if (grid) {
    // The inner grid is likely nested inside the main grid
    innerGrid = grid.querySelector('.w-layout-grid.grid-layout');
  }

  // Edge case: if innerGrid is not present, fallback to using all children of grid
  const colNodes = innerGrid
    ? Array.from(innerGrid.children)
    : grid ? Array.from(grid.children) : [];

  // We'll build two columns: left and right
  // LEFT: Heading, paragraph, divider, avatar block
  // RIGHT: logo svg (last child of inner grid)

  // Left (text/testimonial/author)
  const leftContent = [];
  // Heading
  const heading = grid ? grid.querySelector('.h2-heading') : null;
  if (heading) leftContent.push(heading);
  // Paragraph
  const paragraph = grid ? grid.querySelector('.paragraph-lg') : null;
  if (paragraph) leftContent.push(paragraph);

  // Divider (visual separator)
  // Get only the divider inside the inner grid, not from the full section
  const divider = innerGrid ? innerGrid.querySelector('.divider') : null;
  if (divider) leftContent.push(divider);

  // Avatar and author block
  const flexRow = innerGrid ? innerGrid.querySelector('.flex-horizontal') : null;
  if (flexRow) leftContent.push(flexRow);

  // Right column: logo svg (last child of inner grid)
  let rightContent = [];
  // find utility-display-inline-block
  const logoBlock = innerGrid ? innerGrid.querySelector('.utility-display-inline-block') : null;
  if (logoBlock) {
    rightContent.push(logoBlock);
  } else if (innerGrid) {
    // fallback: find svg
    const svgLogo = innerGrid.querySelector('svg');
    if (svgLogo) rightContent.push(svgLogo);
  }

  // If there is no innerGrid, fallback to using grid children
  if (!innerGrid && colNodes.length > 0) {
    // Try to split in a way that matches the expected left/right
    // Find .flex-horizontal and .divider for left; find svg for right
    const leftParts = [];
    const rightParts = [];
    colNodes.forEach(node => {
      if (
        node.classList.contains('h2-heading') ||
        node.classList.contains('paragraph-lg') ||
        node.classList.contains('divider') ||
        node.classList.contains('flex-horizontal')
      ) {
        leftParts.push(node);
      } else if (
        node.classList.contains('utility-display-inline-block') ||
        node.tagName === 'SVG'
      ) {
        rightParts.push(node);
      }
    });
    if (leftParts.length) leftContent.push(...leftParts);
    if (rightParts.length) rightContent.push(...rightParts);
  }

  // If rightContent is empty, don't leave an empty cell, instead supply []
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
