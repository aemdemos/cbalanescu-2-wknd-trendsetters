/* global WebImporter */
export default function parse(element, { document }) {
  // Build table header
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Get all card anchor elements
  const cards = element.querySelectorAll(':scope > a.utility-link-content-block');
  cards.forEach((card) => {
    // First cell: image (keep the actual <img> element from original DOM)
    let imgEl = card.querySelector('img');

    // Second cell: text content
    // Get meta info
    const metaDiv = card.querySelector('.flex-horizontal');
    let tag = metaDiv ? metaDiv.querySelector('.tag') : null;
    let date = metaDiv ? metaDiv.querySelector('.paragraph-sm') : null;
    // Get heading
    let heading = card.querySelector('h3, h4, .h4-heading');

    // Compose contents for second cell in correct order
    const contents = [];
    if (tag || date) {
      // Keep both meta entries in a new div, spaced
      const metaWrap = document.createElement('div');
      if (tag) metaWrap.appendChild(tag);
      if (date) metaWrap.appendChild(date);
      contents.push(metaWrap);
    }
    if (heading) contents.push(heading);

    rows.push([
      imgEl ? imgEl : '',
      contents.length === 1 ? contents[0] : contents
    ]);
  });

  // Replace original element with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
