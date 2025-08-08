/* global WebImporter */
export default function parse(element, { document }) {
  // == 1. Header Row ==
  const headerRow = ['Cards (cards2)']; // EXACT header as in example

  // == 2. Helper to extract text cell ==
  function makeTextCell(parts) {
    // Only include if not null/empty
    return parts.filter(Boolean);
  }

  // == 3. Get the grid layout ==
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;

  const cells = [headerRow];

  // == 4. Get all card elements ==
  // Main big card: first 'a.utility-link-content-block' in grid
  const cardLinks = grid.querySelectorAll('a.utility-link-content-block');

  // The source layout:
  // - First link: big left card (has image)
  // - Second/third links: middle column cards (with images)
  // - Remaining links (in right vertical): no images, just headings+desc

  // There is a second flex container for right column cards w/o images
  const flexBlocks = grid.querySelectorAll('.flex-horizontal.flex-vertical.flex-gap-sm');

  // --- LEFT BIG CARD ---
  if (cardLinks.length > 0) {
    const leftCard = cardLinks[0];
    // Image
    let img = null;
    const imageDiv = leftCard.querySelector('.utility-aspect-1x1, .utility-aspect-3x2');
    if (imageDiv) {
      img = imageDiv.querySelector('img');
    }
    // Tag
    const tagGroup = leftCard.querySelector('.tag-group');
    const tag = tagGroup ? tagGroup.querySelector('.tag') : null;
    // Heading
    const heading = leftCard.querySelector('h3');
    // Description
    const desc = leftCard.querySelector('p');
    const textParts = [];
    if (tag) textParts.push(tag);
    if (heading) textParts.push(heading);
    if (desc) textParts.push(desc);
    cells.push([
      img || '',
      makeTextCell(textParts)
    ]);
  }

  // --- MIDDLE COLUMN CARDS ---
  // These are the next two card links inside the first flex-horiz flex-vertical flex-gap-sm
  if (flexBlocks.length > 0) {
    // The first flex block contains the two image cards
    const middleCards = flexBlocks[0].querySelectorAll('a.utility-link-content-block');
    middleCards.forEach(card => {
      // Image
      let img = null;
      const imageDiv = card.querySelector('.utility-aspect-3x2');
      if (imageDiv) {
        img = imageDiv.querySelector('img');
      }
      // Tag (optional)
      const tagGroup = card.querySelector('.tag-group');
      const tag = tagGroup ? tagGroup.querySelector('.tag') : null;
      // Heading
      const heading = card.querySelector('h3');
      // Description
      const desc = card.querySelector('p');
      const textParts = [];
      if (tag) textParts.push(tag);
      if (heading) textParts.push(heading);
      if (desc) textParts.push(desc);
      cells.push([
        img || '',
        makeTextCell(textParts)
      ]);
    });
  }

  // --- RIGHT COLUMN CARDS: no images ---
  // These are inside the second flex-horiz flex-vertical flex-gap-sm
  if (flexBlocks.length > 1) {
    const rightCards = flexBlocks[1].querySelectorAll('a.utility-link-content-block');
    rightCards.forEach(card => {
      // Heading
      const heading = card.querySelector('h3');
      // Description
      const desc = card.querySelector('p');
      const textParts = [];
      if (heading) textParts.push(heading);
      if (desc) textParts.push(desc);
      cells.push([
        '', // No image for these cards
        makeTextCell(textParts)
      ]);
    });
  }

  // == 5. Create table & replace element ==
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
