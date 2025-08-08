/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner grid container
  const grid = element.querySelector('.grid-layout');
  const blocks = grid ? Array.from(grid.children) : [];

  // Build each column's semantic content (group all content per column in a single wrapper)
  function getColumnContent(col) {
    // Create a fragment to group all child nodes for semantic grouping
    const frag = document.createDocumentFragment();
    Array.from(col.childNodes).forEach(node => {
      // Only append element or text nodes (skip comments etc.)
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        frag.appendChild(node.cloneNode(true));
      }
    });
    return frag.childNodes.length === 1 ? frag.firstChild : Array.from(frag.childNodes);
  }

  // For columns, semantically group all descendant content in each col
  const columnsRow = blocks.map(getColumnContent);

  // Create table: header is a single cell, second row is the columns (grouped content per column)
  const cells = [
    ['Columns (columns31)'],
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
