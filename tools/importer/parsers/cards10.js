/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in the example
  const headerRow = ['Cards (cards10)'];
  const cells = [headerRow];

  // Get all top-level card links
  const cardLinks = Array.from(element.querySelectorAll(':scope > a'));

  cardLinks.forEach(card => {
    // 1st column: image (must be an <img> element)
    let img = '';
    const imgDiv = card.querySelector(':scope > div');
    if (imgDiv) {
      const possibleImg = imgDiv.querySelector('img');
      if (possibleImg) {
        img = possibleImg;
      }
    }

    // 2nd column: text content (tag, heading, description)
    const textContainer = card.querySelector('.utility-padding-all-1rem');
    const textContent = [];
    if (textContainer) {
      // Tag (optional)
      const tag = textContainer.querySelector('.tag-group .tag');
      if (tag) {
        // Wrap tag in a span (as a robust grouping)
        const tagSpan = document.createElement('span');
        tagSpan.append(tag);
        textContent.push(tagSpan);
      }
      // Heading (mandatory)
      const heading = textContainer.querySelector('h3, .h4-heading');
      if (heading) {
        textContent.push(heading);
      }
      // Description (mandatory)
      const description = textContainer.querySelector('p');
      if (description) {
        textContent.push(description);
      }
    }
    // No CTA in markup, so nothing else to add
    
    cells.push([
      img,
      textContent
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
