/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example
  const headerRow = ['Cards (cards2)'];
  const cells = [headerRow];

  // The cards are grouped in three regions:
  // 1. Large main card (with image, tag, heading, desc)
  // 2. Two smaller cards with images/tags
  // 3. Vertical stack of cards with heading/desc only

  // 1. Main card (the first .utility-link-content-block inside .container)
  const container = element.querySelector('.container');
  if (!container) return;

  const grid = container.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of grid (for order preservation)
  const gridChildren = Array.from(grid.children);

  // Find the main left card
  const mainCard = gridChildren.find(child => child.matches('a.utility-link-content-block'));
  if (mainCard) {
    // Image
    const imgWrap = mainCard.querySelector('div[class*="utility-aspect"]');
    const img = imgWrap ? imgWrap.querySelector('img') : null;
    // Tag group
    const tagGroup = mainCard.querySelector('.tag-group');
    // Heading
    const heading = mainCard.querySelector('h3');
    // Description
    const desc = mainCard.querySelector('p');
    // Compose cell contents, preserving semantic HTML
    const textContent = [];
    if (tagGroup) textContent.push(tagGroup);
    if (heading) textContent.push(heading);
    if (desc) textContent.push(desc);
    cells.push([
      img || '',
      textContent
    ]);
  }

  // 2. Two cards (with images, tags)
  // These are inside a flex container (second child of grid)
  const rightImgCardsWrap = gridChildren.find(child => child.classList.contains('flex-horizontal'));
  if (rightImgCardsWrap) {
    // Only card links
    const imgCards = rightImgCardsWrap.querySelectorAll('a.utility-link-content-block');
    imgCards.forEach(card => {
      const imgWrap = card.querySelector('div[class*="utility-aspect"]');
      const img = imgWrap ? imgWrap.querySelector('img') : null;
      const tagGroup = card.querySelector('.tag-group');
      const heading = card.querySelector('h3');
      const desc = card.querySelector('p');
      const textContent = [];
      if (tagGroup) textContent.push(tagGroup);
      if (heading) textContent.push(heading);
      if (desc) textContent.push(desc);
      cells.push([
        img || '',
        textContent
      ]);
    });
  }

  // 3. Vertical stack (headings/descriptions, no images)
  // Third child of grid
  const verticalStack = gridChildren.find(child => child.classList.contains('flex-horizontal') && child.classList.contains('flex-gap-sm') && child.children.length > 0 && child.querySelectorAll('a.utility-link-content-block').length > 0 && child.querySelectorAll('.divider').length > 0);
  if (verticalStack) {
    // Get all card links (skip dividers)
    const cardLinks = Array.from(verticalStack.querySelectorAll('a.utility-link-content-block'));
    cardLinks.forEach(card => {
      const heading = card.querySelector('h3');
      const desc = card.querySelector('p');
      const textContent = [];
      if (heading) textContent.push(heading);
      if (desc) textContent.push(desc);
      cells.push(['', textContent]);
    });
  }

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
