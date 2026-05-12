/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-contact
 * Base block: columns (doc project – multi-column layout; first row = block name,
 *   subsequent rows have one cell per column placed side-by-side).
 *
 * columns-contact is a 2-column contact info layout:
 *   Left column:  heading ("Let's connect") + introductory paragraph.
 *   Right column: list of contact items (Email with mailto link, Phone with tel link,
 *                 Address as plain text), each preceded by a small eyebrow heading.
 *
 * Source: https://wknd-trendsetters.pages.dev/faq
 *   Selector: main > section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl
 */
export default function parse(element, { document }) {
  // The selector targets the grid-layout itself; its direct children are the columns.
  // Walk only direct child <div>s so nested content (e.g. .contact-items) inside a
  // column is not mistakenly treated as another column.
  let columns = Array.from(element.children).filter((child) => child.tagName === 'DIV');

  // Defensive fallback: if the element passed in is a wrapper around the grid-layout,
  // look one level deeper for the actual grid.
  if (columns.length < 2) {
    const innerGrid = element.querySelector(':scope .grid-layout, :scope > .grid-layout');
    if (innerGrid) {
      columns = Array.from(innerGrid.children).filter((child) => child.tagName === 'DIV');
    }
  }

  // Build the side-by-side content row: one cell per column in source order.
  // Each cell references the original column <div> so all its descendants
  // (heading, paragraph in the left column; contact items with h3 eyebrows and
  // mailto:/tel: anchors or address paragraph in the right column) are preserved
  // in their existing DOM order and semantic markup.
  const contentRow = columns.map((col) => col);

  // Block table:
  //   Row 1 = block name
  //   Row 2 = one cell per column (side-by-side)
  const cells = [contentRow];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-contact',
    cells,
  });

  element.replaceWith(block);
}
