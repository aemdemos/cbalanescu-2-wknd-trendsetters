/* eslint-disable */
/* global WebImporter */

import heroBlogParser from './parsers/hero-blog.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsArticleParser from './parsers/cards-article.js';

import wkndTrendsettersCleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import wkndTrendsettersSectionsTransformer from './transformers/wknd-trendsetters-sections.js';

const parsers = {
  'hero-blog': heroBlogParser,
  'columns-article': columnsArticleParser,
  'cards-article': cardsArticleParser,
};

const transformers = [
  wkndTrendsettersCleanupTransformer,
  wkndTrendsettersSectionsTransformer,
];

const PAGE_TEMPLATE = {
    "name": "blog-listing",
    "urls": [
      "https://wknd-trendsetters.pages.dev/blog"
    ],
    "description": "Blog index/listing page with featured article and article grid",
    "blocks": [
      {
        "name": "hero-blog",
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
        "name": "cards-article",
        "instances": [
          "section#articles .grid-layout.desktop-4-column.grid-gap-md"
        ]
      }
    ],
    "sections": [
      {
        "id": "section-1",
        "name": "Hero",
        "selector": "header.section.secondary-section",
        "style": null,
        "blocks": [
          "hero-blog"
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
        "name": "Latest Articles",
        "selector": "main > section#articles",
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
        "id": "section-4",
        "name": "Subscribe CTA",
        "selector": "main > section.accent-section",
        "style": "accent-yellow",
        "blocks": [],
        "defaultContent": [
          ".utility-text-align-center h2",
          ".utility-text-align-center p",
          ".utility-text-align-center a"
        ]
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
