/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-article
 * Base block: cards (doc project – block table with first row = block name,
 *   each subsequent row = one card with two cells: image | text content).
 *
 * cards-article renders an article listing grid: each card has an image on top,
 * a category tag, a date, and a linked heading. The whole card is a single
 * anchor (<a class="article-card">) that links to the article.
 *
 * Source selector (from page-templates.json): .grid-layout.desktop-4-column.grid-gap-md
 * Source URL examples:
 *   - https://wknd-trendsetters.pages.dev/           (Latest Articles)
 *   - https://wknd-trendsetters.pages.dev/blog      (Latest Articles grid)
 *   - https://wknd-trendsetters.pages.dev/fashion-insights (Trends For Every Vibe)
 *
 * Source DOM (per card):
 *   <a href="/blog/..." class="article-card card-link">
 *     <div class="article-card-image"><img src="..." alt="..."></div>
 *     <div class="article-card-body">
 *       <div class="article-card-meta">
 *         <span class="tag">Category</span>
 *         <span class="paragraph-sm utility-text-secondary">May 12</span>
 *       </div>
 *       <h3 class="h4-heading">Card title</h3>
 *     </div>
 *   </a>
 */
export default function parse(element, { document }) {
  // Collect the card anchors. Prefer direct children of the grid; fall back to any
  // descendant .article-card anchors if the given element wraps the grid.
  let cards = Array.from(
    element.querySelectorAll(':scope > a.article-card, :scope > a.card-link'),
  );
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll('a.article-card'));
  }

  // Build one row per card with exactly two cells: image cell, text cell.
  const cells = cards.map((card) => {
    const href = card.getAttribute('href');
    const img = card.querySelector('.article-card-image img, img');
    const body = card.querySelector('.article-card-body') || card;

    // Meta pieces: the tag (category) and the date. Querying the tag first
    // and excluding it from the date lookup avoids double-selection.
    const tag = body.querySelector('.tag');
    const date = body.querySelector(
      '.article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)',
    );
    const heading = body.querySelector('h2, h3, h4, h5, h6');

    // Column 1: the card image element itself (reference, do not clone).
    const imageCell = img || '';

    // Column 2: text content. The heading is rendered as a link so the whole
    // card remains clickable after authoring. Tag and date are plain paragraphs.
    const textCell = [];
    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      textCell.push(tagP);
    }
    if (heading) {
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent.trim();
        const h = document.createElement(heading.tagName);
        h.appendChild(link);
        textCell.push(h);
      } else {
        textCell.push(heading);
      }
    } else if (href) {
      // Heading missing but link present – preserve the URL as a plain link.
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = href;
      textCell.push(link);
    }
    if (date) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      textCell.push(dateP);
    }

    return [imageCell, textCell];
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-article',
    cells,
  });

  element.replaceWith(block);
}
