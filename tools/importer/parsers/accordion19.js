/* global WebImporter */
export default function parse(element, { document }) {
  // Create table rows starting with the header row matching the block name
  const rows = [
    ['Accordion (accordion19)']
  ];
  // Find all direct accordion items (each is .accordion.w-dropdown)
  const accordionItems = Array.from(element.querySelectorAll(':scope > .accordion.w-dropdown'));

  accordionItems.forEach((item) => {
    // Title cell: from the .w-dropdown-toggle's .paragraph-lg, or fallback to text content excluding icon
    let titleEl = null;
    const toggle = item.querySelector(':scope > .w-dropdown-toggle');
    if (toggle) {
      titleEl = toggle.querySelector('.paragraph-lg');
      if (!titleEl) {
        // Fallback: get all children except the first (icon)
        const toggleChildren = Array.from(toggle.children).filter((c, i) => i > 0);
        if (toggleChildren.length === 1) {
          titleEl = toggleChildren[0];
        } else if (toggleChildren.length > 1) {
          const span = document.createElement('span');
          toggleChildren.forEach(child => span.append(child));
          titleEl = span;
        } else {
          // fallback to any text in toggle
          const span = document.createElement('span');
          span.textContent = toggle.textContent.trim();
          titleEl = span;
        }
      }
    } else {
      // fallback: no toggle, empty
      titleEl = document.createElement('span');
      titleEl.textContent = '';
    }

    // Content cell: nav.accordion-content.w-dropdown-list (take the nav and its content)
    let contentEl = null;
    const nav = item.querySelector('nav.accordion-content.w-dropdown-list');
    if (nav) {
      contentEl = nav;
    } else {
      // fallback: empty div
      contentEl = document.createElement('div');
    }

    rows.push([
      titleEl,
      contentEl
    ]);
  });

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
