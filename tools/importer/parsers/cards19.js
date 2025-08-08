/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards19)'];
  // Get all direct children that are cards
  const cards = Array.from(element.querySelectorAll(':scope > div'));
  const rows = cards.map(card => {
    // ICON CELL (first cell)
    // icon is in card > div.icon (inside first div)
    let iconEl = null;
    const iconContainer = card.querySelector(':scope > div .icon');
    if (iconContainer) {
      iconEl = iconContainer;
    } else {
      // fallback to SVG directly if .icon wrapper not present
      const fallbackSvg = card.querySelector(':scope > div svg');
      if (fallbackSvg) {
        iconEl = fallbackSvg;
      }
    }
    // TEXT CELL (second cell)
    // Only include the <p> itself for text
    let textEl = card.querySelector(':scope > p');
    // Edge case: if no <p> found, try any other textual element
    if (!textEl) {
      textEl = card.querySelector(':scope > div:not(.icon), :scope > span, :scope > h1, :scope > h2, :scope > h3, :scope > h4');
    }
    return [iconEl, textEl];
  });
  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with the table
  element.replaceWith(table);
}
