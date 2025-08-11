/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header row, exactly matching the example
  const headerRow = ['Accordion (accordion13)'];

  // Get all immediate child .divider elements (each is an accordion item)
  const items = Array.from(element.querySelectorAll(':scope > .divider'));

  // Map each accordion item to a table row with 2 cells: [title, content].
  // Reference existing elements directly, handle edge cases robustly.
  const rows = items.map(item => {
    // Each .divider contains a .w-layout-grid with two children
    const grid = item.querySelector('.w-layout-grid');
    if (!grid) return [document.createTextNode(''), document.createTextNode('')]; // fallback blank cells
    // Title: Find first child with .h4-heading
    const title = grid.querySelector('.h4-heading');
    // Content: Find first child with .rich-text, .paragraph-lg, or .w-richtext
    const content = grid.querySelector('.rich-text, .paragraph-lg, .w-richtext');
    // Defensive: If either is missing, use blank
    return [title ? title : document.createTextNode(''), content ? content : document.createTextNode('')];
  });

  // Compose cells for createTable
  const cells = [headerRow, ...rows];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
