/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block EXACTLY as in the example
  const rows = [['Accordion (accordion34)']];

  // Find all direct accordion items
  const accordionItems = element.querySelectorAll(':scope > .w-dropdown');

  accordionItems.forEach(item => {
    // Title cell: the .w-dropdown-toggle > .paragraph-lg (fallback to toggle if missing)
    let titleCell = null;
    const toggle = item.querySelector(':scope > .w-dropdown-toggle');
    if (toggle) {
      // Prefer the .paragraph-lg inside the toggle, else use toggle itself
      const paragraph = toggle.querySelector('.paragraph-lg');
      titleCell = paragraph || toggle;
    }
    // Content cell: .w-dropdown-list > .utility-padding-all-1rem > .w-richtext (fallbacks if missing)
    let contentCell = null;
    const dropdownList = item.querySelector(':scope > .w-dropdown-list');
    if (dropdownList) {
      // Look for the .utility-padding-all-1rem container
      const padDiv = dropdownList.querySelector('.utility-padding-all-1rem') || dropdownList;
      // Prefer .w-richtext inside, else use padDiv itself
      const richText = padDiv.querySelector('.w-richtext') || padDiv;
      contentCell = richText;
    }
    // Defensive: Only include row if both title and content exist
    if (titleCell && contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
