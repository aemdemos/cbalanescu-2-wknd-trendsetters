/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Get immediate children of the main block (these are the columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Each column might have nested content - gather all direct children of each column div
  // If the column contains only one child, use that. If multiple, group them in an array.
  const columnsContent = columns.map(col => {
    const children = Array.from(col.childNodes).filter(
      node => node.nodeType === 1 // Element nodes only
    );
    // If the column contains text nodes (sometimes text is direct), include those too
    const textNodes = Array.from(col.childNodes).filter(
      node => node.nodeType === 3 && node.textContent.trim()
    ).map(node => document.createTextNode(node.textContent));

    if (children.length === 0 && textNodes.length > 0) return textNodes;
    if (children.length === 1 && textNodes.length === 0) return children[0];
    if (children.length === 0 && textNodes.length === 0) return '';
    // Combine elements and text nodes
    return [...textNodes, ...children];
  });

  // Table header: single cell spanning all columns
  const headerRow = ['Columns (columns38)'];

  // Table body: columnsContent is the row containing the columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsContent
  ], document);

  element.replaceWith(table);
}
