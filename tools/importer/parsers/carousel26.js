/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: block name exactly as in the example
  const headerRow = ['Carousel (carousel26)'];

  // Locate card body containing the heading and image
  const cardBody = element.querySelector('.card-body');
  if (!cardBody) return;

  // Get image element (mandatory)
  const img = cardBody.querySelector('img');

  // Get heading element (optional)
  const heading = cardBody.querySelector('.h4-heading');
  // If heading exists, reference its element; otherwise, empty string
  let textCell;
  if (heading) {
    // Use h2 as in the markdown structure in the example
    const h2 = document.createElement('h2');
    h2.innerHTML = heading.innerHTML;
    textCell = h2;
  } else {
    textCell = '';
  }

  // Build table data structure
  const rows = [
    headerRow,
    [img, textCell]
  ];

  // Create the carousel block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
