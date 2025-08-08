/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example
  const headerRow = ['Hero (hero6)'];

  // 2. Extract background image (first <img> descendant)
  const img = element.querySelector('img');
  // If not found, cell will be empty
  const imageRow = [img ? img : ''];

  // 3. Extract the main hero content block (heading, subheading, buttons)
  // Find the card (contains all text and CTAs)
  const card = element.querySelector('.card');
  // If not found, cell will be empty
  const contentRow = [card ? card : ''];

  // 4. Compose table structure
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // 5. Create block table using referenced DOM nodes
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element in the DOM
  element.replaceWith(blockTable);
}
