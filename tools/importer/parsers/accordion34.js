/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match required block name exactly
  const headerRow = ['Accordion (accordion34)'];
  const rows = [headerRow];

  // Get all immediate children accordions (the sections)
  const accordions = element.querySelectorAll(':scope > .accordion');

  accordions.forEach((accordion) => {
    // Title cell: the clickable label, usually in .paragraph-lg within .w-dropdown-toggle
    let titleEl = null;
    const toggle = accordion.querySelector('.w-dropdown-toggle');
    if (toggle) {
      // Usually there is .paragraph-lg inside
      titleEl = toggle.querySelector('.paragraph-lg') || toggle;
    } else {
      // Fallback to accordion itself if no toggle
      titleEl = accordion;
    }

    // Content cell: body/text, typically inside .w-dropdown-list, then .w-richtext or equivalent
    let contentEl = null;
    const dropdownList = accordion.querySelector('.w-dropdown-list');
    if (dropdownList) {
      // Prefer the rich content block if available
      const richContent = dropdownList.querySelector('.w-richtext');
      contentEl = richContent || dropdownList;
    } else {
      // Fallback to accordion itself if no dropdownList
      contentEl = accordion;
    }

    // Push both cells as references (not clones)
    rows.push([
      titleEl,
      contentEl
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
