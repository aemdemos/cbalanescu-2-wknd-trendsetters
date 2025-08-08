/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as per requirements
  const headerRow = ['Columns (columns4)'];

  // Get all direct child divs (the grid columns)
  const gridCells = Array.from(element.querySelectorAll(':scope > div'));

  // For each cell, collect ALL of its content (not just the image)
  const columns = gridCells.map(cell => {
    // If the cell has multiple children, include them all
    const cellContent = Array.from(cell.childNodes).filter(node => {
      // Only keep non-empty text, or elements
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') return true;
      return false;
    });
    // If empty, return empty string
    if (cellContent.length === 0) return '';
    // If one element or node, return that
    if (cellContent.length === 1) return cellContent[0];
    // Otherwise, return an array of nodes
    return cellContent;
  });

  // Build the table rows
  const tableRows = [headerRow, columns];

  // Create and replace with new table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
