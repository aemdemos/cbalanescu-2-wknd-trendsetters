/* eslint-disable */
/* global WebImporter */
/**
 * Parser: hero-blog
 * Base block: hero (1 column, rows: [block name, optional image, text content])
 * Source URL: https://wknd-trendsetters.pages.dev/blog (blog-listing template)
 * Selector: header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl
 *
 * Variant layout in source (blog listing/index page):
 *   The target grid has two direct children placed side-by-side:
 *     1) Text column: <div> containing h1.h1-heading, p.subheading, and
 *        .button-group > a.button (primary + secondary CTAs).
 *     2) Image column: <div class="grid-layout tablet-1-column grid-gap-xs">
 *        containing a single large <img class="cover-image">.
 *
 * Target table shape (per base hero block – 1 column):
 *   Row 1: block name (added automatically by WebImporter.Blocks.createBlock)
 *   Row 2: optional image — the single hero image from the image column
 *   Row 3: text content — heading, subheading paragraph(s), CTA buttons
 */
export default function parse(element, { document }) {
  // ---- Identify direct columns of the outer grid ----
  // The target `element` is the outer grid (`.grid-layout.tablet-1-column.grid-gap-xxl`).
  // Use direct element children to avoid reaching into nested grids.
  const directChildren = Array.from(element.children).filter((n) => n.nodeType === 1);

  // Image column = a direct child that contains at least one <img>.
  // Text column = the remaining direct child (the one not identified as the image column).
  let imageColumn = directChildren.find((child) => child.querySelector('img.cover-image, img[class*="cover"], img'));
  let textColumn = directChildren.find((child) => child !== imageColumn);

  // Defensive fallbacks for structural variations.
  if (!imageColumn) {
    imageColumn = element.querySelector('.grid-layout.grid-gap-xs, .grid-layout[class*="grid-gap-xs"]');
  }
  if (!textColumn) {
    textColumn = element.querySelector(':scope > div:not(.grid-layout)')
      || directChildren.find((child) => child.querySelector('h1, h2, h3, .h1-heading, .h2-heading'));
  }

  // ---- Row 2: optional hero image(s) ----
  // hero-blog typically has a single cover image; keep the logic resilient in case
  // the image column contains multiple images.
  const imageEls = imageColumn
    ? Array.from(imageColumn.querySelectorAll('img.cover-image, img[class*="cover-image"], img'))
    : [];
  // Deduplicate while preserving order (img selectors may overlap).
  const images = Array.from(new Set(imageEls));

  // ---- Row 3: text content (heading, subheading paragraph, CTAs) ----
  const textCell = [];
  if (textColumn) {
    // Heading: prefer h1, fall back to h2/h3 and known heading classes for variations.
    const heading = textColumn.querySelector('h1, h2, h3, .h1-heading, .h2-heading, [class*="heading"]');
    if (heading) textCell.push(heading);

    // Subheading / supporting paragraphs. Use :scope > p to avoid paragraphs from
    // unrelated nested components, and include `.subheading` explicitly.
    const paragraphs = Array.from(
      textColumn.querySelectorAll(':scope > p, :scope > .subheading, :scope p.subheading'),
    );
    const seenP = new Set();
    paragraphs.forEach((p) => {
      if (!seenP.has(p)) {
        seenP.add(p);
        textCell.push(p);
      }
    });

    // CTAs: anchors inside any .button-group, plus any standalone button-class
    // links in the text column (covers primary + secondary CTA variants).
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
    // Single cell containing the hero image (or stacked images if multiple exist).
    cells.push([images.length === 1 ? images[0] : images]);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-blog', cells });
  element.replaceWith(block);
}
