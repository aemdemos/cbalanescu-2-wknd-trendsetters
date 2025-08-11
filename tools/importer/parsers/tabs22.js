/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Find the Tab Menu and Tab Content
  let tabMenu = null;
  let tabContent = null;
  const children = element.querySelectorAll(':scope > div');
  children.forEach(child => {
    if (child.classList.contains('w-tab-menu')) {
      tabMenu = child;
    } else if (child.classList.contains('w-tab-content')) {
      tabContent = child;
    }
  });
  if (!tabMenu || !tabContent) return;

  // Step 2: Get all tab labels (from tabMenu) and tab panes (from tabContent)
  const tabLinks = tabMenu.querySelectorAll(':scope > a');
  const tabPanes = tabContent.querySelectorAll(':scope > div.w-tab-pane');

  // Defensive: If no tabs found, do not create a table
  if (!tabLinks.length || !tabPanes.length) return;

  // Step 3: Build block rows
  const cells = [['Tabs']]; // Header row matches example
  for (let i = 0; i < tabLinks.length; i++) {
    // Extract tab label from <div> inside the <a>, fallback to textContent
    let labelDiv = tabLinks[i].querySelector('div');
    let label = (labelDiv ? labelDiv.textContent : tabLinks[i].textContent).trim();

    // Find corresponding tab content by index (assuming order is correct)
    let pane = tabPanes[i];
    // The tab content in the example is the entire content of each tab pane
    // We'll reference the main child div if present, otherwise the pane itself
    let mainContent = pane.querySelector(':scope > div') || pane;
    cells.push([label, mainContent]);
  }

  // Step 4: Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
