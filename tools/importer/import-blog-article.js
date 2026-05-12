/* eslint-disable */
/* global WebImporter */

import heroBlogPostParser from './parsers/hero-blog-post.js';

import wkndTrendsettersCleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import wkndTrendsettersSectionsTransformer from './transformers/wknd-trendsetters-sections.js';

const parsers = {
  'hero-blog-post': heroBlogPostParser,
};

const transformers = [
  wkndTrendsettersCleanupTransformer,
  wkndTrendsettersSectionsTransformer,
];

const PAGE_TEMPLATE = {
    "name": "blog-article",
    "urls": [
      "https://wknd-trendsetters.pages.dev/blog/latest-trends-young-casual-fashion",
      "https://wknd-trendsetters.pages.dev/blog/fashion-trends-young-culture",
      "https://wknd-trendsetters.pages.dev/blog/fashion-trends-young-style",
      "https://wknd-trendsetters.pages.dev/blog/fashion-blog-post"
    ],
    "description": "Blog article detail page with headline, author metadata, and long-form content",
    "blocks": [
      {
        "name": "hero-blog-post",
        "instances": [
          "main > section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg"
        ]
      }
    ],
    "sections": [
      {
        "id": "section-1",
        "name": "Article Header",
        "selector": "main > section:nth-of-type(1)",
        "style": null,
        "blocks": [
          "hero-blog-post"
        ],
        "defaultContent": []
      },
      {
        "id": "section-2",
        "name": "Article Body",
        "selector": "main > section:nth-of-type(2)",
        "style": null,
        "blocks": [],
        "defaultContent": [
          ".blog-content"
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
