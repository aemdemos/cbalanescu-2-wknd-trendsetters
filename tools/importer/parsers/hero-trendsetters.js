/* eslint-disable */
/* global WebImporter */
/**
 * Parser: hero-trendsetters
 * Base block: hero (1 column, 3 rows: [block name, optional image, text content])
 * Source URL: https://wknd-trendsetters.pages.dev/ (homepage) and landing-page templates
 * Selector: header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl
 *
 * Variant layout in source:
 *   Two children of the target grid:
 *     1) Text column: <div> with h1.h1-heading, p.subheading, optional p, .button-group > a.button
 *     2) Image column: <div class="grid-layout tablet-1-column grid-gap-xs"> containing
 *        multiple <img class="cover-image"> stacked vertically.
 *
 * Target table shape (per base hero block):
 *   Row 1: block name (added automatically by WebImporter.Blocks.createBlock)
 *   Row 2: optional image(s) — includes all stacked cover images from the image column
 *   Row 3: text content — heading, subheading(s)/paragraphs, CTA buttons
 */
export default function parse(element, { document }) {
  // ---- Identify direct columns of the grid ----
  // The target `element` is the outer grid (`.grid-layout.tablet-1-column.grid-gap-xxl`).
  // Prefer direct children to avoid selecting nested grids.
  const directChildren = Array.from(element.children).filter((n) => n.nodeType === 1);

  // Image column = a direct child that contains <img class="cover-image"> elements.
  // Text column = the remaining direct child (the one not identified as the image column).
  let imageColumn = directChildren.find((child) => child.querySelector('img.cover-image, img[class*="cover"]'));
  let textColumn = directChildren.find((child) => child !== imageColumn);

  // Defensive fallbacks if the structure varies slightly.
  if (!imageColumn) {
    imageColumn = element.querySelector('.grid-layout.grid-gap-xs, .grid-layout[class*="grid-gap-xs"]');
  }
  if (!textColumn) {
    textColumn = element.querySelector(':scope > div:not(.grid-layout)')
      || directChildren.find((child) => child.querySelector('h1, h2, h3, .h1-heading, .h2-heading'));
  }

  // ---- Row 2: optional stacked image(s) ----
  const imageEls = imageColumn
    ? Array.from(imageColumn.querySelectorAll('img.cover-image, img[class*="cover-image"], img'))
    : [];
  // Deduplicate while preserving order.
  const images = Array.from(new Set(imageEls));

  // ---- Row 3: text content (heading, subheading(s), paragraphs, CTAs) ----
  const textCell = [];
  if (textColumn) {
    // Heading: prefer h1, fall back to h2/h3 and known heading classes for variations.
    const heading = textColumn.querySelector('h1, h2, h3, .h1-heading, .h2-heading, [class*="heading"]');
    if (heading) textCell.push(heading);

    // Subheading(s) and supporting paragraphs. Use :scope > p to avoid pulling paragraphs
    // from unrelated nested components, and include `.subheading` explicitly in case of wrapping.
    const paragraphs = Array.from(textColumn.querySelectorAll(':scope > p, :scope > .subheading, :scope p.subheading'));
    // Deduplicate (in case a p.subheading matches both selectors).
    const seenP = new Set();
    paragraphs.forEach((p) => {
      if (!seenP.has(p)) {
        seenP.add(p);
        textCell.push(p);
      }
    });

    // CTAs: anchors inside any .button-group, plus any standalone buttons in the text column.
    const ctaLinks = Array.from(
      textColumn.querySelectorAll('.button-group a, a.button, a[class*="button"]'),
    );
    const seenA = new Set();
    ctaLinks.forEach((a) => {
      if (!seenA.has(a)) {
        seenA.add(a);
        textCell.push(a);
      }
    });
  }

  // ---- Assemble cells per base hero block (image row optional) ----
  const cells = [];
  if (images.length > 0) {
    // One cell containing all stacked images in their source order.
    cells.push([images]);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-trendsetters', cells });
  element.replaceWith(block);
}
