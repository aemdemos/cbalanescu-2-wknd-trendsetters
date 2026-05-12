/* global WebImporter */
export default function parse(element, { document }) {
  // Get the .container inside the section
  const container = element.querySelector('.container');
  if (!container) return;
  // Get the first grid, which contains the cards and potentially a nested grid
  const topGrid = container.querySelector('.grid-layout');
  if (!topGrid) return;

  // Gather all cards. Some are direct children <a>, some are in a nested grid.
  // We'll use querySelectorAll(':scope > a, :scope > div > a') to get both top-level and nested ones
  const directCards = Array.from(topGrid.querySelectorAll(':scope > a.utility-link-content-block'));
  const nestedGrid = topGrid.querySelector('div.grid-layout');
  let nestedCards = [];
  if (nestedGrid) {
    nestedCards = Array.from(nestedGrid.querySelectorAll(':scope > a.utility-link-content-block'));
  }
  // All cards in order: first direct, then nested
  const allCards = [...directCards, ...nestedCards];

  // Each card: left cell is the image, right cell is all text/cta
  const rows = allCards.map(card => {
    // Extract the first img in the card
    const img = card.querySelector('img');
    // Extract heading
    let heading = card.querySelector('h2, .h2-heading, .h4-heading');
    // Fallback for heading: sometimes it's just h3 or h4
    if (!heading) heading = card.querySelector('h3, h4');
    // Description paragraph
    const desc = card.querySelector('p');
    // CTA/button (optional)
    const cta = card.querySelector('.button');

    // Image cell: reference element or null
    const imageCell = img || '';

    // Text cell: build array of elements that exist, preserving order
    const textCellContent = [];
    if (heading) textCellContent.push(heading);
    if (desc) textCellContent.push(desc);
    if (cta) textCellContent.push(cta);

    return [imageCell, textCellContent];
  });

  // Build header row, then all card rows
  const cells = [
    ['Cards (cards38)'],
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
