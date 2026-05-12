/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per instructions
  const cells = [['Hero (hero36)']];

  // Second row: background image (none in this HTML, so empty string)
  cells.push(['']);

  // Third row: content (headline, subheading, CTA)
  // Find the grid layout
  const grid = element.querySelector('.grid-layout');
  let contentNodes = [];
  if (grid) {
    // Get all direct children of the grid (should be headline/subheading col and CTA col)
    const gridChildren = Array.from(grid.children);
    if (gridChildren.length) {
      // First child: text column (may contain h1/h2, p)
      const textCol = gridChildren[0];
      // Add all its children (headings, subheadings)
      contentNodes = contentNodes.concat(Array.from(textCol.children));
      // Second child: could be the CTA (e.g. a.button)
      if (gridChildren.length > 1) {
        // If there's a button, add it
        const ctaCol = gridChildren[1];
        // If it's an <a>, use it directly; otherwise, search for <a> inside
        if (ctaCol.tagName.toLowerCase() === 'a') {
          contentNodes.push(ctaCol);
        } else {
          const cta = ctaCol.querySelector('a');
          if (cta) contentNodes.push(cta);
        }
      }
    }
  }

  // Fallback: if we didn't find any content, use empty string
  if (contentNodes.length === 0) {
    cells.push(['']);
  } else {
    cells.push([contentNodes]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
