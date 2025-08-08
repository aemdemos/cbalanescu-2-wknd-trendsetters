/* global WebImporter */
export default function parse(element, { document }) {
  // Table header from example
  const headerRow = ['Hero (hero39)'];

  // --- Row 2: Background Image (optional) ---
  // Find the main image (expected in first grid's first child div)
  let bgImg = null;
  const gridLayout = element.querySelector('.w-layout-grid.grid-layout');
  if (gridLayout) {
    // direct child divs
    const divs = Array.from(gridLayout.children);
    for (const div of divs) {
      const img = div.querySelector('img');
      if (img) {
        bgImg = img;
        break;
      }
    }
  }
  const imageRow = [bgImg ? bgImg : ''];

  // --- Row 3: Content ---
  // Find headline, subheading, cta
  let contentElements = [];
  let textContentDiv = null;
  if (gridLayout) {
    // Second child div typically holds the container for text
    const divs = Array.from(gridLayout.children);
    for (const div of divs) {
      // Look for container with text (h1)
      if (div.querySelector('h1')) {
        textContentDiv = div;
        break;
      }
    }
  }

  if (textContentDiv) {
    // Find grid inside text container (for headline + group)
    const innerGrid = textContentDiv.querySelector('.w-layout-grid');
    if (innerGrid) {
      // Headline
      const h1 = innerGrid.querySelector('h1');
      if (h1) contentElements.push(h1);
      // Find flex container for paragraph and button
      const flex = innerGrid.querySelector('.flex-vertical') || innerGrid;
      // Paragraph(s)
      const paragraphs = flex.querySelectorAll('p');
      paragraphs.forEach(p => contentElements.push(p));
      // Button(s)
      const buttonGroup = flex.querySelector('.button-group');
      if (buttonGroup) {
        buttonGroup.querySelectorAll('a').forEach(a => contentElements.push(a));
      }
    }
  }

  // Compose row with all content elements, as array (if any)
  const contentRow = [contentElements.length ? contentElements : ''];

  // Build table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with table
  element.replaceWith(table);
}
