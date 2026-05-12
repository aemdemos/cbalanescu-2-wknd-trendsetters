/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero10)'];

  // No background image provided in HTML, so row is empty string
  const bgRow = [''];

  // Get the grid container, will always exist in this structure
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Text content left column
  const textDiv = grid.children[0];
  // CTA right column
  const buttonDiv = grid.children[1];

  // Gather content, preserving structure and reference
  const contentEls = [];
  // Heading (optional)
  const heading = textDiv.querySelector('h2, h1, h3, h4, h5, h6');
  if (heading) contentEls.push(heading);
  // Subheading/paragraph (optional)
  // Accept any <p> or <div> (some sites use <div> for subhead)
  const sub = textDiv.querySelector('p, .subheading, div');
  // Avoid duplicating heading if 'div' is the same as heading
  if (sub && (!heading || sub !== heading)) contentEls.push(sub);

  // Collect all CTAs (links/buttons)
  const ctas = buttonDiv.querySelectorAll('a, button');
  ctas.forEach(cta => contentEls.push(cta));

  // Compose content row
  const contentRow = [contentEls];

  // Create block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);

  // Replace element
  element.replaceWith(table);
}
