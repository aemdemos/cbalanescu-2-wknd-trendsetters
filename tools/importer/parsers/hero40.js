/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero40)'];

  // --- Image row (background image) ---
  // The background image is in the first .grid-layout > div > img
  let bgImg = null;
  const gridDivs = element.querySelectorAll(':scope > .w-layout-grid > div');
  if (gridDivs && gridDivs.length > 0) {
    for (const div of gridDivs) {
      const img = div.querySelector('img');
      if (img) {
        bgImg = img;
        break;
      }
    }
  }
  // Fallback: if not found, try globally
  if (!bgImg) {
    bgImg = element.querySelector('img');
  }
  // Handle absence of image
  const imageRow = [bgImg || ''];

  // --- Content row (title, subheading, cta) ---
  let contentCellContent = [];
  if (gridDivs && gridDivs.length > 1) {
    // There's a nested .grid-layout in this div
    const innerGrid = gridDivs[1].querySelector('.w-layout-grid');
    if (innerGrid) {
      // Get the heading
      const h1 = innerGrid.querySelector('h1');
      if (h1) contentCellContent.push(h1);
      // Get the flex-vertical div (subheading and cta)
      const flexVertical = innerGrid.querySelector('.flex-vertical');
      if (flexVertical) {
        // Get paragraph
        const p = flexVertical.querySelector('p');
        if (p) contentCellContent.push(p);
        // Get button(s)
        const buttonGroup = flexVertical.querySelector('.button-group');
        if (buttonGroup) {
          const links = buttonGroup.querySelectorAll('a');
          links.forEach(link => contentCellContent.push(link));
        }
      }
    }
  }
  // Fallback: If no content found, check for h1/p/a in whole element
  if (contentCellContent.length === 0) {
    const h1 = element.querySelector('h1');
    if (h1) contentCellContent.push(h1);
    const p = element.querySelector('p');
    if (p) contentCellContent.push(p);
    const a = element.querySelector('a');
    if (a) contentCellContent.push(a);
  }
  const contentRow = [contentCellContent.length > 0 ? contentCellContent : ['']];

  // Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
