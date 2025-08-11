/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero6)'];

  // 2. Find the background image (should be the main 'img' in the first grid column)
  const img = element.querySelector('img');
  
  // 3. Find the text content container (the card with headings, paragraph, CTAs)
  // Find the card with heading, subheading, and buttons
  let contentContainer = null;
  const allCards = element.querySelectorAll('.card');
  for (const card of allCards) {
    if (card.querySelector('h1, h2, h3, p, [class*=button]')) {
      contentContainer = card;
      break;
    }
  }
  // Fallback: if no card, find largest content block with heading
  if (!contentContainer) {
    contentContainer = element.querySelector('h1, h2, h3, p, [class*=button]')?.parentElement;
  }

  // Edge case: if still not found, fallback to whole element
  if (!contentContainer) {
    contentContainer = element;
  }

  // 4. Fill the rows: header, image, content
  const cells = [
    headerRow,
    [img || ''],
    [contentContainer]
  ];

  // 5. Build and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
