/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout (columns block)
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  const columnDivs = Array.from(grid.children);

  // For each column, try to find the innermost content container
  // This will work both for images-only and for blocks containing text, lists, and buttons
  const cells = columnDivs.map(colDiv => {
    // Try to get the deepest single-child div, else use the column div directly
    let contentNode = colDiv;
    while (
      contentNode &&
      contentNode.children &&
      contentNode.children.length === 1 &&
      contentNode.children[0].tagName === 'DIV'
    ) {
      contentNode = contentNode.children[0];
    }
    // If the contentNode has no child nodes (empty), return an empty string
    // Otherwise, return the node itself (including ALL inner content: images, text, lists, buttons, etc.)
    if (!contentNode || !contentNode.childNodes || contentNode.childNodes.length === 0) {
      return '';
    }
    return contentNode;
  });

  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns16)'],
    cells,
  ], document);

  element.replaceWith(table);
}
