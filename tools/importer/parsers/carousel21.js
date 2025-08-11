/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as a single column (one cell)
  const cells = [['Carousel']];

  // Find all .card elements as slides
  const cardEls = element.querySelectorAll('.card');
  cardEls.forEach((card) => {
    // First cell: image (mandatory)
    const img = card.querySelector('img');
    // Second cell: text content (optional)
    // Collect all direct children in .card-body that are not the image
    const body = card.querySelector('.card-body');
    let textContent = [];
    if (body) {
      body.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'img') return;
        if ((node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) || node.nodeType === Node.TEXT_NODE) {
          textContent.push(node);
        }
      });
    }
    // If nothing in textContent, set cell to null
    if (textContent.length === 0) textContent = null;
    else if (textContent.length === 1) textContent = textContent[0];
    // Add [image, textContent] row
    cells.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
