/* eslint-disable */
/* global WebImporter */
/**
 * Parser: hero-blog-post
 * Base block: hero (1 column, rows: [block name, optional image, text content])
 * Source URLs:
 *   - https://wknd-trendsetters.pages.dev/blog/* (blog-article template — article header)
 *   - https://wknd-trendsetters.pages.dev/case-studies (case-studies template — featured case)
 * Selectors:
 *   - main > section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg (blog-article)
 *   - main > section:nth-of-type(1) .grid-layout.grid-gap-lg (case-studies)
 *
 * Variant layout in source:
 *   The target grid has two direct <div> children placed side-by-side:
 *     1) Image column: contains a large <img class="cover-image"> article cover image.
 *     2) Text column: contains the article metadata stack, in this order:
 *          - <div class="breadcrumbs"> — breadcrumb trail with text-link anchors
 *            (or spans on case-studies) separated by a chevron SVG.
 *          - Heading — <h1 class="h2-heading"> on blog articles,
 *            <h2 class="h2-heading"> on the case-studies featured case.
 *          - Byline block — a wrapper <div> containing two flex-horizontal rows:
 *              a) "By" + author name
 *              b) date + bullet + read-time (read-time may be absent on case-studies)
 *          - Optional <div class="tag"> — topic tag pill (blog articles only).
 *
 * Target table shape (per base hero block — 1 column):
 *   Row 1: block name (added automatically by WebImporter.Blocks.createBlock)
 *   Row 2 (optional): the article cover image
 *   Row 3: text content — breadcrumb, heading, byline block, optional tag pill
 */
export default function parse(element, { document }) {
  // ---- Identify direct columns of the outer grid ----
  // The target `element` is the grid-layout itself; its direct children are the columns.
  // Walk only direct children so nested structures (e.g. the breadcrumb or byline wrappers
  // inside the text column) are not treated as columns.
  const directChildren = Array.from(element.children).filter((n) => n.nodeType === 1);

  // Image column = a direct child that contains at least one <img.cover-image> (or any img).
  // Text column = the remaining direct child.
  let imageColumn = directChildren.find((child) => child.querySelector('img.cover-image, img[class*="cover"], img'));
  let textColumn = directChildren.find((child) => child !== imageColumn);

  // Defensive fallbacks for minor structural variation.
  if (!imageColumn) {
    imageColumn = element.querySelector(':scope > div:has(img), :scope > div img') ? element.querySelector(':scope > div') : null;
  }
  if (!textColumn) {
    textColumn = directChildren.find((child) => child.querySelector('h1, h2, .breadcrumbs, .tag'))
      || element.querySelector(':scope > div:not(:has(img))');
  }

  // ---- Row 2: optional article cover image ----
  // Typically a single cover image; keep resilient in case multiple images exist.
  const imageEls = imageColumn
    ? Array.from(imageColumn.querySelectorAll('img.cover-image, img[class*="cover-image"], img'))
    : [];
  // Deduplicate while preserving order (img selectors may overlap).
  const images = Array.from(new Set(imageEls));

  // ---- Row 3: text content (breadcrumb, heading, byline, optional tag) ----
  const textCell = [];
  if (textColumn) {
    // Breadcrumb trail: include the whole breadcrumbs wrapper to preserve
    // the sequence of anchors/spans and the chevron separator.
    const breadcrumbs = textColumn.querySelector(':scope > .breadcrumbs, .breadcrumbs');
    if (breadcrumbs) textCell.push(breadcrumbs);

    // Heading: prefer h1 (blog-article), fall back to h2 (case-studies featured case)
    // and known heading classes for variations.
    const heading = textColumn.querySelector('h1, h2, .h1-heading, .h2-heading');
    if (heading) textCell.push(heading);

    // Byline + date/read-time block. In source this is a wrapper <div> that contains
    // two flex-horizontal rows (author row + date/read-time row). Prefer the wrapping
    // <div> that holds the flex-horizontal rows so all metadata stays grouped.
    // Strategy: find the first direct child <div> that contains a .flex-horizontal
    // descendant (and is not the breadcrumbs or tag) — that is the byline wrapper.
    let bylineWrapper = null;
    const textColumnChildren = Array.from(textColumn.children).filter((n) => n.nodeType === 1);
    for (const child of textColumnChildren) {
      if (child === breadcrumbs) continue;
      if (child.classList && child.classList.contains('tag')) continue;
      if (child.tagName === 'H1' || child.tagName === 'H2' || child.tagName === 'H3') continue;
      if (child.querySelector('.flex-horizontal')) {
        bylineWrapper = child;
        break;
      }
    }
    // Fallback: if no wrapper found, include any .flex-horizontal rows directly.
    if (bylineWrapper) {
      textCell.push(bylineWrapper);
    } else {
      const flexRows = Array.from(textColumn.querySelectorAll(':scope > .flex-horizontal'));
      flexRows.forEach((row) => textCell.push(row));
    }

    // Optional topic tag pill (present on blog articles, absent on case-studies).
    const tag = textColumn.querySelector(':scope > .tag, .tag');
    if (tag) textCell.push(tag);
  }

  // ---- Assemble cells per base hero block (image row optional) ----
  const cells = [];
  if (images.length > 0) {
    // Single cell containing the cover image (or stacked images if multiple exist).
    cells.push([images.length === 1 ? images[0] : images]);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-blog-post', cells });
  element.replaceWith(block);
}
