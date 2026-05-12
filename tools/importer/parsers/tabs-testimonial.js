/* eslint-disable */
/* global WebImporter */
/**
 * Parser: tabs-testimonial
 * Base block: tabs (2 columns per row: [label, panel content])
 * Source URL: https://wknd-trendsetters.pages.dev/ (homepage) and /case-studies
 * Selector: .tabs-wrapper
 *
 * Source DOM structure (validated against live HTML):
 *   .tabs-wrapper
 *     .tabs-content
 *       .tab-pane[data-tab-index="0".."N"]  -> panel contents in document order
 *         .grid-layout ...
 *           <div> (image wrapper with inner <img class="cover-image">)  -> portrait photo
 *           <div>
 *             <div>
 *               <div class="paragraph-xl utility-margin-bottom-0"><strong>Name</strong></div>
 *               <div>Role</div>
 *             </div>
 *             <p class="paragraph-xl">Quote</p>
 *     .grid-layout ... .tab-menu
 *       <button class="tab-menu-link" data-tab-target="0".."N">  -> tab labels
 *         .flex-horizontal
 *           .avatar > <img class="cover-image">           -> avatar
 *           <div>
 *             <div class="paragraph-sm"><strong>Name</strong></div>
 *             <div class="paragraph-sm">Role</div>
 *
 * Target table shape (per base tabs block, matches /content/index.plain.html):
 *   Row 1: block name ('tabs-testimonial') — added by WebImporter.Blocks.createBlock
 *   Row 2+: one row per tab, 2 columns:
 *     Col 1 (label): avatar image + name (strong) + role
 *     Col 2 (panel): portrait image + name (strong) + role + quote
 *
 * Tabs are paired by data-tab-target (button) ↔ data-tab-index (panel) so
 * menu ordering in the DOM can differ from panel ordering without misalignment.
 */
export default function parse(element, { document }) {
  // Collect tab buttons (labels) and panels, keyed by their tab index so we can
  // align menu entry N with panel N even if the DOM orders them differently.
  const buttons = Array.from(
    element.querySelectorAll('.tab-menu .tab-menu-link, [role="tab"], button[data-tab-target]'),
  );
  const panels = Array.from(
    element.querySelectorAll('.tabs-content .tab-pane, [role="tabpanel"], .tab-pane[data-tab-index]'),
  );

  // Deduplicate while preserving order (multiple selectors may match the same node).
  const uniqueButtons = Array.from(new Set(buttons));
  const uniquePanels = Array.from(new Set(panels));

  const panelByIndex = new Map();
  uniquePanels.forEach((panel, i) => {
    const key = panel.getAttribute('data-tab-index') ?? String(i);
    if (!panelByIndex.has(key)) panelByIndex.set(key, panel);
  });

  const cells = [];

  uniqueButtons.forEach((button, i) => {
    const key = button.getAttribute('data-tab-target') ?? String(i);
    const panel = panelByIndex.get(key) || uniquePanels[i];

    // ---- Label cell (tab menu item): avatar + name + role ----
    const labelCell = [];
    const avatarImg = button.querySelector('.avatar img, img.cover-image, img');
    if (avatarImg) labelCell.push(avatarImg);
    // The text block in the button holds name (strong) and role as sibling divs.
    // Collect the button's inner text blocks (everything except the avatar wrapper).
    const buttonTextEls = Array.from(
      button.querySelectorAll(':scope .flex-horizontal > div:not(.avatar), :scope > div:not(.avatar)'),
    );
    // De-duplicate and avoid pushing the outer flex container itself.
    const seenLabel = new Set();
    buttonTextEls.forEach((el) => {
      if (el.classList.contains('avatar')) return;
      if (el.classList.contains('flex-horizontal')) return;
      if (seenLabel.has(el)) return;
      seenLabel.add(el);
      labelCell.push(el);
    });
    // Fallback if no structured text block was found: use the raw button text.
    if (labelCell.length === 0 || (labelCell.length === 1 && avatarImg)) {
      const fallbackText = (button.textContent || '').trim();
      if (fallbackText) labelCell.push(fallbackText);
    }

    // ---- Panel cell: portrait image + name (strong) + role + quote ----
    const panelCell = [];
    if (panel) {
      const portrait = panel.querySelector('img.cover-image, img');
      if (portrait) panelCell.push(portrait);

      // Name (strong inside a paragraph-xl div) and role (adjacent div).
      const nameEl = panel.querySelector('.paragraph-xl strong, strong');
      if (nameEl) {
        // Wrap the strong on its own line (preserve the <strong>).
        panelCell.push(nameEl);
      }

      // Role: the sibling <div> that follows the name div. It has no class,
      // so we find the text-block wrapper and take its second child div.
      const nameContainer = nameEl ? nameEl.closest('div') : null;
      if (nameContainer) {
        const roleEl = nameContainer.nextElementSibling;
        if (roleEl && roleEl !== nameContainer) panelCell.push(roleEl);
      }

      // Quote paragraph.
      const quoteEl = panel.querySelector('p.paragraph-xl, p');
      if (quoteEl) panelCell.push(quoteEl);
    }

    cells.push([labelCell, panelCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
