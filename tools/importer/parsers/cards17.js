/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards17)'];

  // Get all cards (cardDivs)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  const cardRows = [];

  cardDivs.forEach((cardDiv) => {
    // Find the first image for this card
    const img = cardDiv.querySelector('img');

    // Collect all non-image children as possible text content
    const textElements = [];
    Array.from(cardDiv.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.tagName !== 'IMG') {
        textElements.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Wrap text node in a span for valid HTML element reference
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textElements.push(span);
      }
    });

    // If there is text content, use it, else blank string for text cell
    const textCell = textElements.length ? textElements : '';

    cardRows.push([img, textCell]);
  });

  const cells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
