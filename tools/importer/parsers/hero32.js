/* global WebImporter */
export default function parse(element, { document }) {
  // Create the table header as specified
  const headerRow = ['Hero (hero32)'];

  // The screenshot and example do NOT show a background image, so skip the image row.
  // Find all direct children of the main content grid
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Extract elements from the grid
  // Author (subheading)
  const author = grid.querySelector('.paragraph-xl');
  // Tags
  const tags = grid.querySelector('.flex-vertical');
  // Headline
  const headline = grid.querySelector('h2');
  // Rich text paragraphs
  const richText = grid.querySelector('.rich-text');

  // Compose the content cell in order: headline, author, tags, paragraph
  // Only include elements that exist
  const content = [];
  if (headline) content.push(headline);
  if (author) content.push(author);
  if (tags) content.push(tags);
  if (richText) content.push(richText);

  // Only proceed if there is at least a headline or some text
  if (content.length === 0) return;

  // Compose the cells: header and 2nd row with all content
  const cells = [
    headerRow,
    [content],
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
