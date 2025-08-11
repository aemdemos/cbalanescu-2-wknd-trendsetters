/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  // Get all direct children (columns)
  const gridColumns = Array.from(grid.children);
  // If not at least 2 columns, do nothing
  if (gridColumns.length < 2) return;

  // Helper to gather all meaningful children including text
  function gatherContent(col) {
    // If the column consists of several elements, return all as an array
    const nodes = [];
    Array.from(col.childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        // element node
        nodes.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // text node with content
        const span = document.createElement('span');
        span.textContent = node.textContent;
        nodes.push(span);
      }
    });
    // If only one child, just return the element
    if (nodes.length === 1) return nodes[0];
    // If nothing, return the whole column
    if (nodes.length === 0) return col;
    return nodes;
  }

  const headerRow = ['Columns (columns15)'];
  const contentRow = [gatherContent(gridColumns[0]), gatherContent(gridColumns[1])];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
