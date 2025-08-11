/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout inside the section
  const grid = element.querySelector('.grid-layout, .w-layout-grid');
  if (!grid) return;

  // Get all immediate children (columns)
  const children = Array.from(grid.children);
  // Defensive: The layout may contain 4 children (name, tags, heading, rich text)

  // 1st column (left): name and tags
  const nameEl = children[0]; // Taylor Brooks (div)
  const tagsWrap = children[1]; // Contains tags inside divs
  let tagsList = null;
  if (tagsWrap) {
    const tags = Array.from(tagsWrap.querySelectorAll('.tag'));
    if (tags.length > 0) {
      tagsList = document.createElement('ul');
      tags.forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag.textContent.trim();
        tagsList.appendChild(li);
      });
    }
  }
  const firstColumnContent = [];
  if (nameEl) firstColumnContent.push(nameEl);
  if (tagsList) firstColumnContent.push(tagsList);

  // 2nd column (main): heading and paragraph
  const headingEl = children[2]; // h2 heading
  let richTextEl = null;
  if (children.length >= 4) {
    // Look for .rich-text or .w-richtext in the 4th child
    richTextEl = children[3].querySelector('.rich-text, .w-richtext, .paragraph-lg');
    if (!richTextEl) richTextEl = children[3]; // fallback to whole div
  }
  const secondColumnContent = [];
  if (headingEl) secondColumnContent.push(headingEl);
  if (richTextEl) secondColumnContent.push(richTextEl);

  // Build the table rows
  const headerRow = ['Columns (columns30)'];
  const contentRow = [firstColumnContent, secondColumnContent];

  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
