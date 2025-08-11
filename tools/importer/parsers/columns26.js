/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the column layout
  const container = element.querySelector('.container');
  if (!container) return;
  const topGrid = container.querySelector('.grid-layout');
  if (!topGrid) return;

  // Get all immediate children of the main grid (these are blocks/columns)
  // For this HTML, first two are heading + testimonial text; third is testimonial meta block grid
  const columns = Array.from(topGrid.children);

  // Compose left column: heading + paragraph
  const leftDiv = document.createElement('div');
  if (columns[0]) leftDiv.appendChild(columns[0]);
  if (columns[1]) leftDiv.appendChild(columns[1]);

  // Compose right column: testimonial meta (avatar/name/role + SVG logo)
  const rightDiv = document.createElement('div');
  if (columns[2]) rightDiv.appendChild(columns[2]);

  // Build header row as per guidelines
  const headerRow = ['Columns (columns26)'];
  // Build content row with two columns
  const contentRow = [leftDiv, rightDiv];

  // Create table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
