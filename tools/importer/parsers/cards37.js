/* global WebImporter */
export default function parse(element, { document }) {
  // Table header EXACTLY as specified in the example
  const headerRow = ['Cards (cards37)'];

  // Find the container and main grid
  const container = element.querySelector('.container');
  if (!container) return;
  const mainGrid = container.querySelector('.grid-layout');
  if (!mainGrid) return;

  // Collect all possible card elements from top-level grid and any nested grid
  let cardElements = [];
  Array.from(mainGrid.children).forEach(child => {
    if (child.matches('a.utility-link-content-block')) {
      cardElements.push(child);
    } else if (child.matches('.grid-layout')) {
      // Nested grid, get all its link children
      cardElements.push(...Array.from(child.children).filter(e => e.matches('a.utility-link-content-block')));
    }
  });

  const rows = cardElements.map(card => {
    // Find image element (inside .utility-aspect-*)
    const aspectDiv = card.querySelector('.utility-aspect-2x3, .utility-aspect-1x1');
    const img = aspectDiv ? aspectDiv.querySelector('img') : null;
    const imageCell = img || '';

    // Build text cell
    // Find heading
    let heading = card.querySelector('h3');
    // Find paragraphs
    let paragraphs = Array.from(card.querySelectorAll('p'));
    // Find button or cta if present
    let button = card.querySelector('.button');

    // Compose the content cell array
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (paragraphs.length) contentCell.push(...paragraphs);
    if (button) contentCell.push(button);

    return [imageCell, contentCell];
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
