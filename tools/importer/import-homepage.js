/* eslint-disable */
/* global WebImporter */

import heroTrendsettersParser from './parsers/hero-trendsetters.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroBannerParser from './parsers/hero-banner.js';

import wkndTrendsettersCleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import wkndTrendsettersSectionsTransformer from './transformers/wknd-trendsetters-sections.js';

const parsers = {
  'hero-trendsetters': heroTrendsettersParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
};

const transformers = [
  wkndTrendsettersCleanupTransformer,
  wkndTrendsettersSectionsTransformer,
];

const PAGE_TEMPLATE = {
    "name": "homepage",
    "urls": [
      "https://wknd-trendsetters.pages.dev/"
    ],
    "description": "Homepage with hero, featured content, gallery, testimonials, articles, FAQ and CTA sections",
    "blocks": [
      {
        "name": "hero-trendsetters",
        "instances": [
          "header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl"
        ]
      },
      {
        "name": "columns-article",
        "instances": [
          "main > section:nth-of-type(1) .grid-layout.grid-gap-lg"
        ]
      },
      {
        "name": "cards-gallery",
        "instances": [
          "main > section:nth-of-type(2) .grid-layout.desktop-4-column.grid-gap-sm"
        ]
      },
      {
        "name": "tabs-testimonial",
        "instances": [
          ".tabs-wrapper"
        ]
      },
      {
        "name": "cards-article",
        "instances": [
          ".grid-layout.desktop-4-column.grid-gap-md"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          ".faq-list"
        ]
      },
      {
        "name": "hero-banner",
        "instances": [
          "section.inverse-section .utility-position-relative",
          "section.inverse-section .container > *:last-child"
        ]
      }
    ],
    "sections": [
      {
        "id": "section-1",
        "name": "Hero",
        "selector": "header.section.secondary-section",
        "style": "cream",
        "blocks": [
          "hero-trendsetters"
        ],
        "defaultContent": []
      },
      {
        "id": "section-2",
        "name": "Featured Article",
        "selector": "main > section:nth-of-type(1)",
        "style": null,
        "blocks": [
          "columns-article"
        ],
        "defaultContent": []
      },
      {
        "id": "section-3",
        "name": "Image Gallery",
        "selector": "main > section:nth-of-type(2)",
        "style": "cream",
        "blocks": [
          "cards-gallery"
        ],
        "defaultContent": [
          ".utility-text-align-center h2",
          ".utility-text-align-center .paragraph-lg"
        ]
      },
      {
        "id": "section-4",
        "name": "Testimonials",
        "selector": "main > section:nth-of-type(3)",
        "style": null,
        "blocks": [
          "tabs-testimonial"
        ],
        "defaultContent": []
      },
      {
        "id": "section-5",
        "name": "Latest Articles",
        "selector": "main > section:nth-of-type(4)",
        "style": "cream",
        "blocks": [
          "cards-article"
        ],
        "defaultContent": [
          ".utility-text-align-center h2",
          ".utility-text-align-center .paragraph-lg"
        ]
      },
      {
        "id": "section-6",
        "name": "FAQ",
        "selector": "main > section:nth-of-type(5)",
        "style": null,
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": [
          ".grid-layout > div:first-child h2",
          ".grid-layout > div:first-child .subheading"
        ]
      },
      {
        "id": "section-7",
        "name": "CTA Banner",
        "selector": "section.section.inverse-section",
        "style": "dark",
        "blocks": [
          "hero-banner"
        ],
        "defaultContent": []
      }
    ]
  };

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    let rawPath = new URL(params.originalURL).pathname.replace(/\.html$/, '');
    if (rawPath === '' || rawPath === '/') rawPath = '/index';
    else rawPath = rawPath.replace(/\/$/, '');
    const sanitizedPath = WebImporter.FileUtils.sanitizePath(rawPath);

    return [{
      element: main,
      path: sanitizedPath,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
