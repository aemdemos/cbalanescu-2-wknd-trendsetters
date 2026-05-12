/* global WebImporter */
export default function parse(element, { document }) {
  // Header must be exactly as in the example
  const headerRow = ['Cards (cards35)'];
  // Each card is a direct child <a>
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  const rows = cards.map(card => {
    // Image: always first <img> in card
    const img = card.querySelector('img');
    
    // Find the div that contains all text content after the image
    // The structure is <a> > <div> (the grid wrapper) > [img, text-holder-div]
    // We want the text-holder-div (not the grid itself, but its second child)
    let textDiv = null;
    const gridDiv = card.querySelector('div.w-layout-grid');
    if (gridDiv) {
      // Find the child of the grid that is NOT the image
      textDiv = Array.from(gridDiv.children).find(child => child !== img);
    }
    // Fallback: if not found, take the first div after the image
    if (!textDiv) {
      const allDivs = Array.from(card.querySelectorAll('div'));
      textDiv = allDivs.find(div => !div.contains(img) && div !== gridDiv);
    }
    
    // If still not found, fallback to gridDiv or card
    if (!textDiv) textDiv = gridDiv || card;
    
    // Reference the actual textDiv from the DOM, don't clone (reference semantics)
    // This ensures we retain all content (badges, time, heading, description, CTA, etc)
    return [img, textDiv];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
