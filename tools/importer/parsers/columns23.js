/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid of images
  const imageGrid = element.querySelector('.grid-layout.desktop-3-column.utility-min-height-100dvh');
  const imageDivs = imageGrid ? Array.from(imageGrid.children) : [];
  const images = imageDivs.map(div => div.querySelector('img')).filter(img => img);

  // Get the central text content (headline, subheading, buttons)
  const contentCol = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');

  // Compose the header row (must be a single cell)
  const headerRow = ['Columns (columns23)'];

  // Images cell: stack all images in one div
  const imagesCell = document.createElement('div');
  images.forEach(img => imagesCell.appendChild(img));

  // Content cell: reference the content container, or empty div if not found
  const contentCell = contentCol || document.createElement('div');

  // Compose the main content row with two columns
  const contentRow = [imagesCell, contentCell];

  // Build the final table structure
  const cells = [
    headerRow,    // single cell header row
    contentRow    // second row, 2 columns
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
