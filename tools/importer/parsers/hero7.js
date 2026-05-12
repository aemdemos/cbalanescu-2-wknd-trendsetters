/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as required by the example
  const headerRow = ['Hero (hero7)'];

  // Get all immediate children of the grid (should be image containers)
  const children = Array.from(element.querySelectorAll(':scope > div'));
  // Find all <img> elements directly under these divs
  const images = children
    .map(div => div.querySelector('img'))
    .filter(Boolean);

  // Table row for images: all images together in a single cell
  const imageRow = [images];

  // There is NO content row (no heading, subheading, CTA) in the provided HTML
  const contentRow = [''];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
