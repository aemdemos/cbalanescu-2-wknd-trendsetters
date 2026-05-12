/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row as a single cell
  const rows = [['Tabs']];
  // For each tab, add a row with two columns: label, empty content
  const tabLinks = Array.from(element.querySelectorAll(':scope > a'));
  tabLinks.forEach((a) => {
    let label = '';
    const innerDiv = a.querySelector(':scope > div');
    if (innerDiv) {
      label = innerDiv.textContent.trim();
    } else {
      label = a.textContent.trim();
    }
    rows.push([label, '']);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
