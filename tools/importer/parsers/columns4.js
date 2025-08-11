/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs - each represents a column
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, include ALL child nodes (not just images!)
  const columnCells = columns.map(col => {
    // To support all possible kinds of content, include all children
    const content = Array.from(col.childNodes).filter(node => {
      // Filter out empty text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim() !== '';
      }
      return true;
    });
    return content.length === 1 ? content[0] : content;
  });

  // Compose header row and columns row
  const headerRow = ['Columns (columns4)'];
  const tableRows = [headerRow, columnCells];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
