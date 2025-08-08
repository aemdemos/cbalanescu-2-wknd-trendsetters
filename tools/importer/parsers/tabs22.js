/* global WebImporter */
export default function parse(element, { document }) {
  // Find tab menu (tab labels)
  const tabMenu = Array.from(element.children).find(el => el.classList.contains('w-tab-menu'));
  // Get all tab links
  const tabLinks = Array.from(tabMenu ? tabMenu.querySelectorAll('a') : []);
  // Extract labels (prefer inner text of div inside link)
  const tabLabels = tabLinks.map(link => {
    const labelDiv = link.querySelector('div');
    return labelDiv ? labelDiv.textContent.trim() : link.textContent.trim();
  });

  // Find tab content wrapper
  const tabContentWrapper = Array.from(element.children).find(el => el.classList.contains('w-tab-content'));
  // Get all tab panes
  const tabPanes = Array.from(tabContentWrapper ? tabContentWrapper.querySelectorAll('.w-tab-pane') : []);

  // Compose the header row: single cell array
  const headerRow = ['Tabs'];

  // Each tab row is [label, content] as two cells
  const tabRows = tabPanes.map((pane, idx) => {
    // Get matching label
    const label = tabLabels[idx] || '';
    // Get tab content: reference all children of the inner grid if exists, else all children of pane
    const grid = pane.querySelector('.w-layout-grid');
    let contentArr = grid ? Array.from(grid.children) : Array.from(pane.children);
    // If there is no content, fallback to empty string
    if (contentArr.length === 0) contentArr = [''];
    return [label, contentArr];
  });

  // Build cells: first row is single cell, subsequent rows have two cells
  const cells = [headerRow, ...tabRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace element
  element.replaceWith(block);
}
