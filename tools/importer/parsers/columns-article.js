/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-article
 * Base block: columns (doc project – multi-column layout; first row = block name,
 *   subsequent rows have one cell per column placed side-by-side).
 *
 * columns-article is used for two layouts sharing the same 2-column structure:
 *   1. Article-intro (homepage):    image | breadcrumb + heading + byline + date
 *   2. Featured-article (blog):     image | tag + date + heading + paragraph + CTA
 *
 * Source: https://wknd-trendsetters.pages.dev/ and /blog (first main section .grid-layout.grid-gap-lg)
 */
export default function parse(element, { document }) {
  // The selector targets the grid-layout itself; its direct children are the columns.
  // Walk only direct child <div>s so nested grids inside a column are not treated as columns.
  const columnEls = Array.from(element.children).filter((child) => child.tagName === 'DIV');

  // Defensive fallback: if the element given is a wrapper around the grid-layout,
  // look one level deeper.
  let columns = columnEls;
  if (columns.length < 2) {
    const innerGrid = element.querySelector(':scope .grid-layout, :scope > .grid-layout');
    if (innerGrid) {
      columns = Array.from(innerGrid.children).filter((child) => child.tagName === 'DIV');
    }
  }

  // Build the side-by-side content row: one cell per column in source order.
  // Each cell references the original column <div> so all its descendants
  // (image, breadcrumb, tag, heading, paragraph, byline, date, button) are preserved
  // in their existing DOM order and semantic markup.
  const contentRow = columns.map((col) => col);

  // Block table:
  //   Row 1 = block name
  //   Row 2 = one cell per column (side-by-side)
  const cells = [contentRow];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-article',
    cells,
  });

  element.replaceWith(block);
}
