/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: Must match example exactly
  const headerRow = ['Hero (hero30)'];

  // Get immediate children of the grid layout
  const grid = element.querySelector('.grid-layout');
  let bgImg = '';
  let contentElem = '';
  if (grid) {
    // The background image is in the first cell: .ix-parallax-scale-out-hero > img
    const firstCell = grid.children[0];
    if (firstCell) {
      const parallax = firstCell.querySelector('.ix-parallax-scale-out-hero');
      if (parallax) {
        const img = parallax.querySelector('img');
        if (img) {
          bgImg = img;
        }
      }
    }
    // The heading/content is in the second cell: .utility-margin-bottom-6rem
    const secondCell = grid.children[1];
    if (secondCell) {
      const contentDiv = secondCell.querySelector('.utility-margin-bottom-6rem');
      if (contentDiv) {
        contentElem = contentDiv;
      }
    }
  }

  // Compose table: 1 column, 3 rows
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentElem ? contentElem : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
