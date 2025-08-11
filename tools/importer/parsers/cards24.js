/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];
  // Each card is an <a> direct child of element
  const cardLinks = Array.from(element.querySelectorAll(':scope > a'));

  cardLinks.forEach((card) => {
    // First cell (Image/Icon)
    const imageDiv = Array.from(card.children).find(
      el => el.classList.contains('utility-aspect-2x3')
    );
    let img = null;
    if (imageDiv) {
      img = Array.from(imageDiv.children).find(el => el.tagName === 'IMG');
    }
    // Second cell (Text content)
    // Tag & Date row then Heading
    const infoDiv = Array.from(card.children).find(
      el => el.classList.contains('flex-horizontal')
    );
    const tag = infoDiv ? Array.from(infoDiv.children).find(el => el.classList.contains('tag')) : null;
    const date = infoDiv ? Array.from(infoDiv.children).find(el => el.classList.contains('paragraph-sm')) : null;
    // Heading
    const heading = Array.from(card.children).find(
      el => el.tagName === 'H3' || el.classList.contains('h4-heading')
    );
    // Compose the text cell
    const textCellContent = [];
    if (tag || date) {
      const tagDateDiv = document.createElement('div');
      if (tag) tagDateDiv.appendChild(tag);
      if (date) tagDateDiv.appendChild(date);
      textCellContent.push(tagDateDiv);
    }
    if (heading) {
      textCellContent.push(heading);
    }
    rows.push([
      img || '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
