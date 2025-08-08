/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row exactly as in the example
  const headerRow = ['Cards (cards23)'];
  const cells = [headerRow];

  // Get all tab panes
  const tabPanes = element.querySelectorAll('.w-tab-pane');
  tabPanes.forEach(tabPane => {
    // Each tabPane contains a grid of cards
    const grid = tabPane.querySelector('.w-layout-grid');
    if (!grid) return;
    // Each card is an <a> direct child of the grid
    const cards = grid.querySelectorAll(':scope > a');
    cards.forEach(card => {
      // First column: image or empty string if not present
      let img = null;
      const aspectDiv = card.querySelector('.utility-aspect-3x2');
      if (aspectDiv) {
        const foundImg = aspectDiv.querySelector('img');
        if (foundImg) img = foundImg;
      }
      // Second column: text (heading and description)
      // Find heading (h3) and description (paragraph-sm)
      let heading = card.querySelector('h3');
      let desc = card.querySelector('.paragraph-sm');
      const textCell = [];
      if (heading) textCell.push(heading);
      if (desc) textCell.push(desc);
      // Edge case: if both missing, fallback to card itself
      if (!heading && !desc) textCell.push(card);
      // Compose row: image | text
      cells.push([
        img ? img : '',
        textCell.length === 1 ? textCell[0] : textCell
      ]);
    });
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
