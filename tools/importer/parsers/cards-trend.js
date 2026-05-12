/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-trend
 * Base block: cards (doc project – block table with first row = block name,
 *   each subsequent row = one card with two cells: image | text content).
 *
 * cards-trend renders a borderless 3-column grid of trend categories. Each
 * card has a 3:2 cover image on top, an h3 heading, and a short paragraph
 * description. There are no tags, no dates, and no links – just image +
 * heading + description per card.
 *
 * Source selector (from tools/importer/page-templates.json):
 *   main > section:nth-of-type(1) .grid-layout.desktop-3-column
 * Source URL examples (live HTML validated 2026-05-11):
 *   - https://wknd-trendsetters.pages.dev/fashion-trends-young-adults
 *   - https://wknd-trendsetters.pages.dev/fashion-trends-young-adults-casual-sport
 *   - https://wknd-trendsetters.pages.dev/fashion-trends-of-the-season
 *   - https://wknd-trendsetters.pages.dev/fashion-insights
 *
 * Source DOM (per card, validated against live HTML):
 *   <div>
 *     <img src="/images/..." alt="..." class="cover-image utility-aspect-3x2" loading="lazy">
 *     <h2 class="h3-heading">Tennis looks, game strong</h2>
 *     <p class="paragraph-sm">Crisp polos, bold sneakers, and clean lines...</p>
 *   </div>
 *
 * The grid itself is:
 *   <div class="grid-layout desktop-3-column ...">
 *     <div>...</div>
 *     <div>...</div>
 *     <div>...</div>
 *   </div>
 */
export default function parse(element, { document }) {
  // Collect each card tile. Prefer direct children of the grid so we don't
  // accidentally pick up nested content. The cards are plain <div> children
  // with no distinguishing class, so we filter to those that contain an image
  // (which uniquely identifies a card tile in this variant).
  let cards = Array.from(element.querySelectorAll(':scope > div')).filter(
    (div) => div.querySelector('img'),
  );

  // Fallback: if the given element wraps the grid rather than being the grid
  // itself, look one level deeper for card-shaped children.
  if (cards.length === 0) {
    cards = Array.from(
      element.querySelectorAll(':scope > div > div'),
    ).filter((div) => div.querySelector('img'));
  }

  // Second fallback: any descendant div that contains a cover-image + heading.
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll('div')).filter(
      (div) =>
        div.querySelector(':scope > img.cover-image, :scope > img') &&
        div.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6'),
    );
  }

  // Build one row per card with exactly two cells: image cell, text cell.
  const cells = cards
    .map((card) => {
      // Column 1: the card image element itself (reference, not a clone).
      // Prefer the canonical cover-image, fall back to any img in the card.
      const img =
        card.querySelector('img.cover-image, img.utility-aspect-3x2') ||
        card.querySelector('img');

      // Column 2: heading + description, preserving semantic HTML.
      const heading = card.querySelector(
        'h1, h2, h3, h4, h5, h6, .h3-heading, [class*="heading"]',
      );
      const description = card.querySelector(
        'p, .paragraph-sm, [class*="paragraph"]',
      );

      // If a card is missing both image and text, skip it defensively so the
      // resulting table matches the block library structure (no empty rows).
      if (!img && !heading && !description) return null;

      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);

      return [img || '', textCell];
    })
    .filter((row) => row !== null);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-trend',
    cells,
  });

  element.replaceWith(block);
}
