/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card elements in source order
  // The main grid contains direct card children and possibly a nested grid for more cards
  function getCardElements(root) {
    const cards = [];
    // Find all top-level children in .grid-layout
    Array.from(root.children).forEach(child => {
      if (child.classList.contains('utility-link-content-block')) {
        cards.push(child);
      } else if (child.classList.contains('grid-layout')) {
        // Nested grid: collect its card children
        Array.from(child.children).forEach(innerChild => {
          if (innerChild.classList.contains('utility-link-content-block')) {
            cards.push(innerChild);
          }
        });
      }
    });
    return cards;
  }

  // Find the main grid holding the cards
  const mainGrid = element.querySelector('.grid-layout') || element;
  const cards = getCardElements(mainGrid);

  // Set up block table: header, then one row per card
  const cells = [['Cards (cards37)']];

  cards.forEach(card => {
    // IMAGE: find image inside .utility-aspect-2x3 or .utility-aspect-1x1
    let imageWrapper = card.querySelector('.utility-aspect-2x3, .utility-aspect-1x1');
    let image = imageWrapper ? imageWrapper.querySelector('img') : null;

    // TEXT: find the text container in the card
    // Sometimes it's in .utility-padding-all-2rem, sometimes direct
    let textContainer = card.querySelector('.utility-padding-all-2rem') || card;

    // Find the heading (h2, h3, or h4)
    let heading = textContainer.querySelector('h2, h3, h4');
    // Find main description (first <p> descendant)
    let desc = textContainer.querySelector('p');
    // Optional CTA button (with class .button)
    let cta = textContainer.querySelector('.button');

    // Build array for all present text elements, in correct order
    const textContent = [];
    if (heading) textContent.push(heading);
    if (desc) textContent.push(desc);
    if (cta) textContent.push(cta);

    // Add row to cells: [image, [heading, desc, cta]]
    cells.push([image, textContent]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
