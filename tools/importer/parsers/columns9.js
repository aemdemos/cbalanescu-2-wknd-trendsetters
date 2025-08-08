/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid columns container in the footer
  const gridContainer = element.querySelector('.grid-layout');
  let columnElements = [];
  if (gridContainer) {
    columnElements = Array.from(gridContainer.children);
  }
  // Create table
  // The header row MUST be a single cell spanning all columns (as per prompt)
  const table = document.createElement('table');
  // Header row: single <th> with colspan set to #columns
  const headerRow = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns9)';
  if (columnElements.length > 1) {
    th.colSpan = columnElements.length;
  }
  headerRow.appendChild(th);
  table.appendChild(headerRow);
  // Content row: one <td> per column
  if (columnElements.length > 0) {
    const contentRow = document.createElement('tr');
    columnElements.forEach(col => {
      const td = document.createElement('td');
      td.appendChild(col);
      contentRow.appendChild(td);
    });
    table.appendChild(contentRow);
  }
  element.replaceWith(table);
}
