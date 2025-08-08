/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) block header
  const headerRow = ['Cards (cards10)'];
  const cells = [headerRow];

  // Get all card elements (direct children anchor tags)
  const cardEls = element.querySelectorAll(':scope > a');
  cardEls.forEach(card => {
    // Image cell (image always in first child div)
    const imgDiv = card.querySelector(':scope > div:first-child');
    const img = imgDiv ? imgDiv.querySelector('img') : null;

    // Text cell content (second child div)
    const textDiv = card.querySelector(':scope > div.utility-padding-all-1rem');
    let textCellContent = [];
    if (textDiv) {
      // Get tag label if present
      const tagDiv = textDiv.querySelector('.tag-group .tag');
      if (tagDiv) textCellContent.push(tagDiv);
      // Heading
      const heading = textDiv.querySelector('h3, .h4-heading');
      if (heading) textCellContent.push(heading);
      // Description (paragraph)
      const desc = textDiv.querySelector('p, .paragraph-sm');
      if (desc) textCellContent.push(desc);
      // If future CTAs (linked text) appear, they would be added here
    }
    // Add the card row if there's an image and some text
    if (img && textCellContent.length > 0) {
      cells.push([img, textCellContent]);
    }
  });

  // Create the cards table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original block element with the new table
  element.replaceWith(table);
}
