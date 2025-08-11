/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW
  const headerRow = ['Columns (columns36)'];

  // Locate the main grid containing columns
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;

  // Get immediate child divs of the grid for each column
  const colDivs = grid.querySelectorAll(':scope > div');
  if (colDivs.length < 2) return;

  // --- LEFT COLUMN: Text Content ---
  const textCol = colDivs[0];
  const textColContents = [];

  // Add heading(s)
  const h1 = textCol.querySelector('h1');
  if (h1) textColContents.push(h1);

  // Add subheading/paragraph(s)
  const p = textCol.querySelector('p');
  if (p) textColContents.push(p);

  // Add button group (if present)
  const buttonGroup = textCol.querySelector('.button-group');
  if (buttonGroup) textColContents.push(buttonGroup);

  // --- RIGHT COLUMN: Images ---
  const imagesCol = colDivs[1];
  let imageElements = [];

  // Most images are inside a nested grid-layout
  const imagesGrid = imagesCol.querySelector('.grid-layout');
  if (imagesGrid) {
    imageElements = Array.from(imagesGrid.querySelectorAll('img'));
  } else {
    imageElements = Array.from(imagesCol.querySelectorAll('img'));
  }

  // Compose the columns block table: header row, then one row with two columns
  const cells = [
    headerRow,
    [textColContents, imageElements]
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
