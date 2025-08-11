/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid layout element that contains columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get all immediate children (column blocks)
  const cols = Array.from(grid.children);

  // For each column, extract all content inside (images and any other content)
  // In this HTML, each column contains an image only, but this logic works for text or mixed content too
  const columnCells = cols.map(col => {
    // Get all child nodes of the column (should be a single div containing an image)
    const content = Array.from(col.childNodes).filter(n => {
      // Only include element nodes and non-empty text nodes
      return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
    });
    // If only one child, just reference it. If multiple, use array.
    return content.length === 1 ? content[0] : content;
  });

  // Compose header row as per requirements (single column)
  const headerRow = ['Columns (columns16)'];
  // Compose the block table cells
  const cells = [headerRow, columnCells];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with new block table
  element.replaceWith(block);
}
