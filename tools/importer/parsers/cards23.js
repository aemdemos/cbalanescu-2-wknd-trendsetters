/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a grid
  function extractCards(gridEl) {
    const cards = [];
    // Only consider direct children that are anchor tags (cards)
    const gridItems = Array.from(gridEl.children).filter(child => child.tagName === 'A');
    for (const item of gridItems) {
      // Find image element if present as direct descendant
      let imgEl = item.querySelector('img');
      // Find heading
      let heading = item.querySelector('h3');
      // Find description paragraph
      let para = item.querySelector('.paragraph-sm');
      // Compose text cell - only add present elements
      const textParts = [];
      if (heading) textParts.push(heading);
      if (para) textParts.push(para);
      // Compose the card row: Image/Icon, Text content
      cards.push([imgEl || '', textParts]);
    }
    return cards;
  }
  // Prepare table rows starting with the header
  const blockRows = [['Cards (cards23)']];
  // There may be multiple tab panes, each with a grid
  const tabPanes = Array.from(element.querySelectorAll(':scope > .w-tab-pane'));
  for (const tab of tabPanes) {
    const grid = tab.querySelector('.w-layout-grid');
    if (grid) {
      const cardRows = extractCards(grid);
      blockRows.push(...cardRows);
    }
  }
  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(blockRows, document);
  element.replaceWith(table);
}
