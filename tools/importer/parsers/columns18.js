/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout (columns)
  let grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) {
    grid = element.querySelector('.w-layout-grid');
  }
  if (!grid) {
    // fallback: just use first div inside container
    const container = element.querySelector('.container');
    grid = container ? container.firstElementChild : null;
  }
  if (!grid) {
    // fallback: use direct children of section
    grid = element;
  }
  // Extract direct child columns
  const columns = Array.from(grid.children);
  // Compose the table header row
  const headerRow = ['Columns (columns18)'];
  // Compose the content row
  const contentRow = columns.map((col) => {
    // If the column is an image, just reference it
    if (col.tagName === 'IMG') {
      return col;
    }
    // If the column contains only an image directly, reference that
    const onlyImg = col.children.length === 1 && col.children[0].tagName === 'IMG';
    if (onlyImg) {
      return col.children[0];
    }
    // Otherwise, reference all the children of col (preserving order & structure)
    // If col is a UL or info block, use as-is
    if (col.tagName === 'UL' || col.tagName === 'OL') {
      return col;
    }
    // For content divs, reference the div itself for maximum resilience
    return col;
  });
  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
