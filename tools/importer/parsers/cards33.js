/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row (matches exactly):
  const headerRow = ['Cards (cards33)'];

  // 2. Get all card <a> elements that are direct children of the grid:
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  // 3. Build rows for each card
  const rows = cards.map(card => {
    // 3a. Image: first img in the card
    const img = card.querySelector('img');

    // 3b. Find the inner content container (the div holding text content)
    // Usually the second child of the inner grid: <div.w-layout-grid> with no img
    const innerGrid = card.querySelector('div.w-layout-grid');
    let textContentDiv = null;
    if (innerGrid) {
      // Find the div that is not the parent of the image
      textContentDiv = Array.from(innerGrid.children).find(child => !child.querySelector('img'));
    }

    // 3c. Compose the content cell by referencing all text/informational children in order
    const textCellContent = [];
    if (textContentDiv) {
      // Tag & read time (horizontal flex)
      const tagTimeRow = textContentDiv.querySelector('.flex-horizontal');
      if (tagTimeRow) textCellContent.push(tagTimeRow);
      // Heading
      const heading = textContentDiv.querySelector('h3');
      if (heading) textCellContent.push(heading);
      // Description
      const desc = textContentDiv.querySelector('p');
      if (desc) textCellContent.push(desc);
      // CTA: a div with text 'Read', direct child of textContentDiv
      const ctaDiv = Array.from(textContentDiv.children).find(child => child.textContent.trim().toLowerCase() === 'read');
      if (ctaDiv) textCellContent.push(ctaDiv);
    }
    // Defensive fallback if no textContentDiv
    if (!textContentDiv || textCellContent.length === 0) {
      // fallback: include any text directly from card's children after img
      const fallbackText = Array.from(card.children).filter(c => c !== img && c.tagName !== 'IMG');
      if (fallbackText.length) textCellContent.push(...fallbackText);
    }

    return [img, textCellContent];
  });

  // 4. Compose full table: header, then rows
  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // 5. Replace original element with block table
  element.replaceWith(block);
}
