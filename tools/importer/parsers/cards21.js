/* global WebImporter */
export default function parse(element, { document }) {
  // 1. The header row
  const headerRow = ['Cards (cards21)'];

  // 2. Extract card content
  // Structure: .utility-position-sticky > div > .card > .card-body
  // .card-body contains: .h4-heading (title), img (image)
  let cardBody = element.querySelector('.card-body');
  let img = null;
  let heading = null;
  let description = null;
  let textCell = [];

  if (cardBody) {
    img = cardBody.querySelector('img');
    heading = cardBody.querySelector('.h4-heading');
    // Find description below heading (if present)
    // Look for next sibling after heading that is an element and not the image
    if (heading) {
      let next = heading.nextElementSibling;
      while (next && (next.tagName === 'IMG' || next === img)) {
        next = next.nextElementSibling;
      }
      if (next) description = next;
    }
    // Add heading and description in the proper order
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    // If neither, leave cell empty
    if (textCell.length === 0) textCell = [''];
  }

  // 3. Table rows, following the example structure: header, then one row per card (image, text)
  const rows = [
    headerRow,
    [img, textCell]
  ];

  // 4. Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
