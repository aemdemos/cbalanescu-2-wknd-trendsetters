/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero15)'];

  // 2. Find the image (background asset)
  // Look for the first <img> inside the grid
  const grid = element.querySelector('.grid-layout');
  let heroImg = null;
  if (grid) {
    heroImg = grid.querySelector('img');
  }
  const imageRow = [heroImg ? heroImg : ''];

  // 3. Collect heading, subheading, and CTAs
  let contentCol = null;
  // In this markup, the div with id="w-node-_85b6655c-7c4a-e9e3-9ce9-a5af31fcf1c3-31fcf1be" holds text/buttons
  if (grid) {
    // Find all direct child divs of grid
    const gridDivs = grid.querySelectorAll(':scope > div');
    contentCol = Array.from(gridDivs).find(
      (div) => div.querySelector('h1, h2, h3, h4, h5, h6')
    );
  }
  const content = [];
  if (contentCol) {
    // Heading (h1-h6)
    const heading = contentCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) content.push(heading);
    // Subheading (class or first <p>)
    const subheading = contentCol.querySelector('.subheading, p');
    if (subheading) content.push(subheading);
    // Button group (collect all buttons/links)
    const buttonGroup = contentCol.querySelector('.button-group');
    if (buttonGroup) {
      const buttons = Array.from(buttonGroup.querySelectorAll('a'));
      if (buttons.length) content.push(...buttons);
    }
  }
  const contentRow = [content];

  // 4. Assemble block table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
