/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell with the block name
  const headerRow = ['Columns (columns38)'];

  // Find all direct children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Each column's content: just the <img> element inside (or the div itself if no img)
  const contentCells = columns.map(col => {
    const img = col.querySelector('img');
    return img || col;
  });
  // The content row must be a single array, where each item is a column cell
  const contentRow = contentCells;

  // Structure: header row (one cell), content row (N columns)
  const cells = [
    headerRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}