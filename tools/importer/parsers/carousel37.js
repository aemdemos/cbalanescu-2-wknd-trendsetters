/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header exactly as in the example
  const headerRow = ['Carousel (carousel37)'];

  // 2. Find the grid holding text and images
  const grid = element.querySelector('.grid-layout');
  let textCol = null, imgCol = null;
  if (grid) {
    const children = Array.from(grid.children);
    // Heuristic: textCol is the one with a heading, imgCol has images
    children.forEach((child) => {
      if (!textCol && child.querySelector('h1,h2,h3,h4,h5,h6')) {
        textCol = child;
      }
      if (!imgCol && child.querySelector('img')) {
        imgCol = child;
      }
    });
  }

  // 3. Compose text cell (for first image/slide)
  let textCellContent = [];
  if (textCol) {
    // Heading
    const heading = textCol.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) {
      textCellContent.push(heading);
    }
    // Subheading/Description
    const subheading = textCol.querySelector('p');
    if (subheading) {
      textCellContent.push(subheading);
    }
    // CTAs/buttons
    const btnGroup = textCol.querySelector('.button-group');
    if (btnGroup) {
      // Each link (a) on its own line
      btnGroup.querySelectorAll('a').forEach((a, idx, arr) => {
        textCellContent.push(a);
        if (idx < arr.length - 1) {
          textCellContent.push(document.createElement('br'));
        }
      });
    }
  }

  // 4. Get slide images
  let slides = [];
  if (imgCol) {
    // Find all <img> within this col (direct children or inside a grid)
    let imgs = Array.from(imgCol.querySelectorAll('img'));
    imgs.forEach((img, idx) => {
      if (idx === 0) {
        slides.push([img, textCellContent]);
      } else {
        slides.push([img, '']);
      }
    });
  }

  // 5. Compose table rows: header + all slides
  const tableRows = [headerRow, ...slides];

  // 6. Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
