/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly as in the example
  const headerRow = ['Hero (hero20)'];

  // --- 2nd row: Images (background collage) ---
  // Find the desktop grid with all images
  let imageGrid = null;
  const gridDivs = element.querySelectorAll('.grid-layout');
  for (const grid of gridDivs) {
    // The image grid should contain multiple .utility-position-relative divs each with an img
    if (grid.querySelectorAll('img').length >= 3) {
      imageGrid = grid;
      break;
    }
  }
  // Get all images inside that grid
  let images = [];
  if (imageGrid) {
    images = Array.from(imageGrid.querySelectorAll('img')).filter(img => img.src);
  }
  // If no images found, leave empty
  const imageRow = [images.length > 0 ? images : ''];

  // --- 3rd row: Headline, subheading, CTA ---
  // Find the content container with heading, subheading, CTA
  let contentGroup = null;
  // Try common containers for hero content
  contentGroup = element.querySelector('.ix-hero-scale-3x-to-1x-content .container, .container.small-container, .ix-hero-scale-3x-to-1x-content');
  if (!contentGroup) {
    // fallback: find first container with h1 inside
    const h1 = element.querySelector('h1');
    if (h1) {
      contentGroup = h1.closest('div');
    }
  }
  // If not found, fallback to empty
  const contentRow = [contentGroup || ''];

  // Compose block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
