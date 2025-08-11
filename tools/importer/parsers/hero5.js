/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as in example
  const headerRow = ['Hero (hero5)'];

  // Find top-level grid container
  const grid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');

  // Edge case: grid not found
  if (!grid) {
    // fallback: try to extract first image and heading from section
    const img = element.querySelector('img');
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    const paragraph = element.querySelector('p');
    const buttonGroup = element.querySelector('.button-group');
    const contentEls = [];
    if (heading) contentEls.push(heading);
    if (paragraph) contentEls.push(paragraph);
    if (buttonGroup) contentEls.push(buttonGroup);
    const rows = [
      headerRow,
      img ? [img] : [''],
      contentEls.length ? [contentEls] : ['']
    ];
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
    return;
  }

  // There should be two direct children: one content, one image
  let imgEl = null;
  let contentEl = null;
  Array.from(grid.children).forEach(child => {
    if (child.tagName === 'IMG') {
      imgEl = child;
    } else if (child.querySelector('h1, h2, h3, h4, h5, h6') || child.querySelector('.rich-text') || child.querySelector('.button-group')) {
      contentEl = child;
    }
  });

  // 2nd row: background image
  const imageRow = imgEl ? [imgEl] : [''];

  // 3rd row: heading, paragraph, and button group in a single cell
  const contentParts = [];
  if (contentEl) {
    // Find heading (keep level from source)
    const heading = contentEl.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentParts.push(heading);
    // Find rich text paragraph (could be div.rich-text or direct p)
    const richText = contentEl.querySelector('.rich-text');
    if (richText) {
      // richText might have multiple paragraphs
      Array.from(richText.children).forEach(node => {
        // Only add elements
        if (node.nodeType === 1) contentParts.push(node);
      });
    } else {
      // fallback: direct p
      const p = contentEl.querySelector('p');
      if (p) contentParts.push(p);
    }
    // Find button group
    const buttonGroup = contentEl.querySelector('.button-group');
    if (buttonGroup) contentParts.push(buttonGroup);
  }

  const contentRow = contentParts.length ? [contentParts] : [''];

  // Compose the table with structure: 1 column, 3 rows
  const tableRows = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
