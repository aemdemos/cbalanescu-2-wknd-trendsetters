/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-gallery
 * Base block: cards (doc project – block table with first row = block name,
 *   each subsequent row = one card; two-column base model but this variant
 *   is image-only, so each card row contains just the image cell).
 *
 * cards-gallery renders a photo gallery grid: each card is a square 1x1
 * image with no heading, no text, no link. The base `cards` block uses
 * image | text columns, but the gallery variant omits the text side entirely
 * per the block library (see /workspace/content/index.plain.html which shows
 * `<div class="cards-gallery"><div><div><img/></div></div>...` – a single
 * image cell per row, no text cell).
 *
 * Source selector (from tools/importer/page-templates.json):
 *   main > section:nth-of-type(2) .grid-layout.desktop-4-column.grid-gap-sm
 * Source URL examples (live HTML validated 2026-05-11):
 *   - https://wknd-trendsetters.pages.dev/                  (Image Gallery section, 8 cards)
 *   - https://wknd-trendsetters.pages.dev/fashion-insights  (Style Gallery)
 *   - https://wknd-trendsetters.pages.dev/case-studies      (Image Gallery)
 *
 * Source DOM (per card, validated against live HTML):
 *   <div class="utility-aspect-1x1">
 *     <img src="/images/..." alt="..." class="cover-image" loading="lazy">
 *   </div>
 *
 * The grid itself is:
 *   <div class="grid-layout desktop-4-column tablet-2-column-1 mobile-portrait-1-column grid-gap-sm">
 *     <div class="utility-aspect-1x1">...</div>
 *     <div class="utility-aspect-1x1">...</div>
 *     ... (N cards)
 *   </div>
 */
export default function parse(element, { document }) {
  // Collect each card tile. Prefer direct children scoped to the grid element
  // (to avoid picking up images from sibling sections), with fallbacks in case
  // the `utility-aspect-1x1` class name changes or a card wraps its image in
  // another square-aspect container.
  let cards = Array.from(
    element.querySelectorAll(':scope > .utility-aspect-1x1'),
  );
  if (cards.length === 0) {
    // Fallback 1: any utility-aspect-1x1 descendant (if the given element is a
    // wrapper around the actual grid).
    cards = Array.from(element.querySelectorAll('.utility-aspect-1x1'));
  }
  if (cards.length === 0) {
    // Fallback 2: any direct-child div containing an img (safe because the
    // gallery grid should only contain image tiles, no headings or text nodes).
    cards = Array.from(element.querySelectorAll(':scope > div')).filter(
      (div) => div.querySelector('img'),
    );
  }

  // Build one row per card. Each row is a single-cell row containing the
  // image element (reference, do not clone). Rows with no image are skipped
  // defensively so the table output matches the block library exactly.
  const cells = cards
    .map((card) => {
      const img = card.querySelector('img');
      return img ? [img] : null;
    })
    .filter((row) => row !== null);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-gallery',
    cells,
  });

  element.replaceWith(block);
}
