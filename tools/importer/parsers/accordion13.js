/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion13) block header
  const headerRow = ['Accordion (accordion13)'];

  // Find all accordion items = direct .divider children of the given element
  const dividers = Array.from(element.querySelectorAll(':scope > .divider'));

  const rows = [];

  dividers.forEach(divider => {
    // Each divider contains a .grid-layout with 2 children: title and content
    const grid = divider.querySelector('.grid-layout');
    if (!grid) return;
    const [titleEl, contentEl] = Array.from(grid.children);
    // Add only if both exist, otherwise skip this item
    if (titleEl && contentEl) {
      rows.push([titleEl, contentEl]);
    }
  });

  // Compose the cells structure: first row header, then per item rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
