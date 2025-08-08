/* global WebImporter */
export default function parse(element, { document }) {
  // Table header is a single cell string, exactly as specified in the example
  const headerRow = ['Columns (columns29)'];
  // Extract all immediate children (these are the columns)
  const columnDivs = element.querySelectorAll(':scope > div');
  // Each column's main content is an img element
  const cellsRow = Array.from(columnDivs).map(div => {
    const img = div.querySelector('img');
    return img ? img : div;
  });
  // The first row (header) must be a single cell, even if following rows have multiple columns
  // This is the intended structure and matches the example: header as one cell, content row as multiple columns
  const cells = [headerRow, cellsRow];
  // Create the table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
