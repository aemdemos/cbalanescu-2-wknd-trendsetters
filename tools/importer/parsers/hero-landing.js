/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-landing. Base: hero.
 * Source: https://wknd-trendsetters.pages.dev/
 * Selector: header.secondary-section
 * Hero block: 1 column. Row 1 = images, Row 2 = heading + subheading + CTAs
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: hero images grouped in one cell
  const heroImages = element.querySelectorAll('.grid-layout .grid-layout img, .grid-layout img.cover-image');
  if (heroImages.length > 0) {
    const imageContainer = document.createElement('div');
    heroImages.forEach((img) => imageContainer.append(img));
    cells.push([imageContainer]);
  }

  // Row 2: heading + subheading + CTAs grouped in one cell
  const contentContainer = document.createElement('div');

  const heading = element.querySelector('h1, h2, .h1-heading');
  if (heading) contentContainer.append(heading);

  const subheading = element.querySelector('p.subheading, .subheading');
  if (subheading) contentContainer.append(subheading);

  const ctaLinks = element.querySelectorAll('.button-group a.button');
  ctaLinks.forEach((link) => contentContainer.append(link));

  if (contentContainer.childNodes.length > 0) cells.push([contentContainer]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
