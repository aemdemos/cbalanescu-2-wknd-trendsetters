/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: create a content fragment for the text cell (tag, heading, desc)
  function createTextCell({ tagNode, headingNode, descNode }) {
    const frag = document.createDocumentFragment();
    if (tagNode) {
      frag.appendChild(tagNode);
    }
    if (headingNode) {
      frag.appendChild(headingNode);
    }
    if (descNode) {
      frag.appendChild(descNode);
    }
    return frag.childNodes.length === 1 ? frag.firstChild : frag;
  }

  // Find the grid containing the cards
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  const cells = [['Cards (cards5)']];

  // --- Featured Left Card ---
  const gridChildren = Array.from(grid.children);
  // First card is the large left card
  const mainCard = gridChildren.find(
    node => node.matches('a.utility-link-content-block')
  );
  if (mainCard) {
    const imgWrap = mainCard.querySelector('.utility-aspect-1x1');
    const img = imgWrap ? imgWrap.querySelector('img.cover-image') : null;
    // Extract tag group, heading, desc
    const tagGroup = mainCard.querySelector('.tag-group');
    const heading = mainCard.querySelector('h3');
    const desc = mainCard.querySelector('p');
    cells.push([
      img,
      createTextCell({ tagNode: tagGroup, headingNode: heading, descNode: desc })
    ]);
  }

  // --- Two Cards with Images ---
  // Next direct child is a div.flex-horizontal.flex-vertical (with 2 cards)
  const cardRows = gridChildren.filter(
    node => node.classList.contains('flex-horizontal') && node.classList.contains('flex-vertical')
  );
  if (cardRows.length > 0) {
    // First row: contains two cards with images
    const imageCards = cardRows[0].querySelectorAll('a.utility-link-content-block');
    imageCards.forEach(card => {
      const imgWrap = card.querySelector('.utility-aspect-3x2');
      const img = imgWrap ? imgWrap.querySelector('img.cover-image') : null;
      const tagGroup = card.querySelector('.tag-group');
      const heading = card.querySelector('h3');
      const desc = card.querySelector('p');
      cells.push([
        img,
        createTextCell({ tagNode: tagGroup, headingNode: heading, descNode: desc })
      ]);
    });
  }

  // --- Text Only Cards ---
  // Second row: contains text-only cards (no image)
  if (cardRows.length > 1) {
    const textCardsRow = cardRows[1];
    const textCards = Array.from(textCardsRow.children).filter(node => node.matches('a.utility-link-content-block'));
    textCards.forEach(card => {
      const heading = card.querySelector('h3');
      const desc = card.querySelector('p');
      cells.push([
        '',
        createTextCell({ headingNode: heading, descNode: desc })
      ]);
    });
  }

  // Replace original element with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
