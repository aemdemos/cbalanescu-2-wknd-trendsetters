/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs, each is a column
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Header row: block name in first column, each other column is ''
  const headerRow = ['Columns (columns29)'];
  for (let i = 1; i < columns.length; i++) {
    headerRow.push('');
  }

  // Content row: reference original divs
  const contentRow = columns.map(col => col);

  // Build the table
  const cells = [
    headerRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
