/* eslint-disable */
/* global WebImporter */
/**
 * Parser: hero-banner
 * Base block: hero (1 column, rows: [block name, optional image, text content])
 * Source URLs:
 *   - https://wknd-trendsetters.pages.dev/ (homepage, CTA banner section)
 *   - https://wknd-trendsetters.pages.dev/case-studies (CTA banner section)
 * Selectors (from page-templates.json):
 *   - section.inverse-section .utility-position-relative
 *   - section.inverse-section .container > *:last-child (resolves to the grid-layout wrapper)
 *
 * Variant in source:
 *   A full-bleed dark CTA banner. Either the target `element` is the
 *   `.utility-position-relative` card itself, or a wrapper (e.g. `.grid-layout`)
 *   containing it. Inside, the card has:
 *     - <img class="cover-image utility-overlay"> — background image
 *     - <div class="overlay"> — decorative dark overlay (not extracted)
 *     - <div class="card-body"> — contains:
 *         <h2 class="h1-heading"> — heading
 *         <p class="subheading"> — subheading/description
 *         <div class="button-group"> > <a class="button inverse-button"> — single CTA
 *
 * Target table shape (per base hero block):
 *   Row 1: block name (added automatically by WebImporter.Blocks.createBlock)
 *   Row 2 (optional): background image
 *   Row 3: text content — heading + subheading(s)/paragraphs + CTA button(s)
 */
export default function parse(element, { document }) {
  // ---- Identify the banner card ----
  // Support both selector variants by resolving to the inner `.utility-position-relative`
  // card when the passed element is a wrapper. If the element already IS the card, keep it.
  let card = element;
  if (!card.matches('.utility-position-relative')) {
    const inner = card.querySelector('.utility-position-relative');
    if (inner) card = inner;
  }

  // ---- Row 2: background image ----
  // Prefer the full-bleed overlay cover image; fall back to any img with cover/background hints.
  const bgImage = card.querySelector(
    'img.cover-image.utility-overlay, img.cover-image, img[class*="cover-image"], img[class*="background"]'
  );

  // ---- Row 3: text content container ----
  // The card-body holds heading, subheading, and CTAs. Fall back to the card itself, and
  // ultimately to the original element, so we still find content if the inner card has
  // already been replaced by a prior pass (wrapper-level selector re-entering the DOM).
  const bodyEl = card.querySelector('.card-body, [class*="card-body"]')
    || (card !== element ? card : element);

  // Search scope for content lookups — prefer body; fall back to the broader element if needed.
  const searchRoots = [bodyEl, element].filter((n, i, a) => n && a.indexOf(n) === i);

  const queryFirst = (selector) => {
    for (const root of searchRoots) {
      const hit = root.querySelector(selector);
      if (hit) return hit;
    }
    return null;
  };
  const queryAll = (selector) => {
    const out = [];
    const seen = new Set();
    for (const root of searchRoots) {
      root.querySelectorAll(selector).forEach((n) => {
        if (!seen.has(n)) {
          seen.add(n);
          out.push(n);
        }
      });
    }
    return out;
  };

  // Heading: prefer h1/h2 with heading-class hints; fall back to h3.
  const heading = queryFirst('h1, h2, .h1-heading, .h2-heading, [class*="heading"]')
    || queryFirst('h3');

  // Subheading/description paragraph(s). Include `.subheading` and `.paragraph-*` class hints
  // explicitly so we catch the description even when it's nested deeper than a direct child
  // (which happens when a wrapper-level selector runs after an inner pass).
  const paragraphs = queryAll('p.subheading, p.paragraph-lg, p.paragraph-sm, p');

  // CTA(s): anchors inside any .button-group plus any standalone `.button` anchors.
  // Use `a.button` to avoid matching anchors merely contained in elements with "button" in
  // the class name; this selector is mutually exclusive with `.button-group a` only when the
  // same anchor matches both — dedupe below handles that.
  const ctaLinks = queryAll('.button-group a, a.button');

  // ---- Build the text cell (heading, paragraphs, CTAs) ----
  const textCell = [];
  if (heading) textCell.push(heading);

  const seenP = new Set();
  paragraphs.forEach((p) => {
    if (!seenP.has(p)) {
      seenP.add(p);
      textCell.push(p);
    }
  });

  const seenA = new Set();
  ctaLinks.forEach((a) => {
    if (!seenA.has(a)) {
      seenA.add(a);
      textCell.push(a);
    }
  });

  // ---- Assemble cells per base hero block (image row optional) ----
  const cells = [];
  if (bgImage) {
    cells.push([bgImage]);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
