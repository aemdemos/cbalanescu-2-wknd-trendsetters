/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel grid with slides
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Slides are the direct children of the grid
  const slideWrappers = Array.from(grid.children);

  // Initialize the table with the correct header
  const cells = [['Carousel (carousel18)']];

  slideWrappers.forEach((slide) => {
    // Look for the image within the slide
    const aspect = slide.querySelector('.utility-aspect-2x3');
    let img = null;
    if (aspect) {
      img = aspect.querySelector('img');
    }

    // Try to find any text content for the slide (supporting future variations)
    // Accept anything that is not the image container as possible text
    let textContent = '';
    // Look for siblings of aspect that may contain text
    if (slide.children.length > 1) {
      // Collect all siblings of aspect that are not the aspect (image container)
      const textNodes = Array.from(slide.children).filter(child => child !== aspect);
      // If found, include all as the text cell
      if (textNodes.length > 0) {
        textContent = textNodes;
      }
    }

    // If no sibling text nodes, also check descendants of aspect for overlays/text
    if (!textContent || (Array.isArray(textContent) && textContent.length === 0)) {
      // Sometimes overlays are INSIDE the image container
      const possibleText = Array.from(aspect ? aspect.children : []).filter(child => child.tagName !== 'IMG');
      if (possibleText.length > 0) {
        textContent = possibleText;
      }
    }

    // If textContent is still empty, use an empty string
    if (!textContent || (Array.isArray(textContent) && textContent.length === 0)) {
      textContent = '';
    }

    // Only process if there is an image
    if (img) {
      cells.push([
        img,
        textContent
      ]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the generated table
  element.replaceWith(table);
}
