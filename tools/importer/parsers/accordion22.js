/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header as per example
  const headerRow = ['Accordion (accordion22)'];
  // Find all direct children with class 'divider' (each one is an accordion item)
  const dividers = element.querySelectorAll(':scope > .divider');
  const rows = [];
  dividers.forEach(divider => {
    // Each divider contains a grid-layout with two children: title and content
    const grid = divider.querySelector('.grid-layout');
    if (!grid) return; // skip if missing
    const children = grid.querySelectorAll(':scope > div');
    if (children.length >= 2) {
      // Reference the original title and content elements
      const title = children[0];
      const content = children[1];
      rows.push([title, content]);
    } else if (children.length === 1) {
      // Edge case: missing content, insert empty cell
      rows.push([children[0], '']);
    }
    // If no children, skip
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
