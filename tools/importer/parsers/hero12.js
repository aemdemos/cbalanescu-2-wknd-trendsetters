/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name must match exactly
  const headerRow = ['Hero (hero12)'];

  // 1. Get the background image (first .utility-position-relative img)
  let bgImg = null;
  const bgContainer = element.querySelector('.utility-position-relative');
  if (bgContainer) {
    const img = bgContainer.querySelector('img');
    if (img) bgImg = img;
  }
  // Background image row
  const bgRow = [bgImg ? bgImg : ''];

  // 2. Get the content for the content row (headline, extras, cta)
  // The .card-body contains all the content
  let contentRowContent = null;
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    contentRowContent = cardBody;
  } else {
    // fallback: if not found, try to grab all content except background image
    // This is defensive code for edge cases
    const contentDivs = Array.from(element.querySelectorAll(':scope > div'));
    // Remove the bg img container
    if (bgContainer && contentDivs.includes(bgContainer)) {
      contentDivs.splice(contentDivs.indexOf(bgContainer), 1);
    }
    contentRowContent = contentDivs.length ? contentDivs : '';
  }

  // 3. Compose the table rows
  const rows = [
    headerRow, // row 1: block name
    bgRow,     // row 2: background image (optional)
    [contentRowContent] // row 3: content (headline, bullets, cta)
  ];

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
