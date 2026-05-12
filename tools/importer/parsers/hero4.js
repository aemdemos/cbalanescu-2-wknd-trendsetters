/* global WebImporter */
export default function parse(element, { document }) {
  // Set up the table header
  const headerRow = ['Hero (hero4)'];

  // This block does not have a background image
  const backgroundImageRow = [''];

  // Get the grid with the relevant content
  const grid = element.querySelector('.grid-layout');
  let content = [];

  if (grid) {
    // Grab all direct children of the grid
    const children = grid.children;
    // Find the heading (should be h2)
    let heading = null;
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName && children[i].tagName.toLowerCase().startsWith('h')) {
        heading = children[i];
        break;
      }
    }
    if (heading) content.push(heading);

    // Get the div containing the paragraph and CTA (could be other layout variations)
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName && children[i].tagName.toLowerCase() === 'div') {
        // Add all <p> and <a> children in the div
        const p = children[i].querySelector('p');
        const a = children[i].querySelector('a');
        if (p) content.push(p);
        if (a) content.push(a);
      }
    }
  }
  // Defensive fallback: if nothing was found, the cell should be empty
  if (content.length === 0) content = [''];

  const contentRow = [content];

  const cells = [
    headerRow,
    backgroundImageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
