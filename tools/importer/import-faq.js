/* eslint-disable */
/* global WebImporter */

import heroFaqParser from './parsers/hero-faq.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsContactParser from './parsers/columns-contact.js';

import wkndTrendsettersCleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import wkndTrendsettersSectionsTransformer from './transformers/wknd-trendsetters-sections.js';

const parsers = {
  'hero-faq': heroFaqParser,
  'accordion-faq': accordionFaqParser,
  'columns-contact': columnsContactParser,
};

const transformers = [
  wkndTrendsettersCleanupTransformer,
  wkndTrendsettersSectionsTransformer,
];

const PAGE_TEMPLATE = {
    "name": "faq",
    "urls": [
      "https://wknd-trendsetters.pages.dev/faq"
    ],
    "description": "FAQ page with hero, accordion, contact info, and CTA",
    "blocks": [
      {
        "name": "hero-faq",
        "instances": [
          "header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          ".faq-list"
        ]
      },
      {
        "name": "columns-contact",
        "instances": [
          "main > section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl"
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
          "hero-faq"
        ],
        "defaultContent": []
      },
      {
        "id": "section-2",
        "name": "FAQ",
        "selector": "main > section:nth-of-type(1)",
        "style": null,
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": []
      },
      {
        "id": "section-3",
        "name": "Contact",
        "selector": "main > section.secondary-section",
        "style": "cream",
        "blocks": [
          "columns-contact"
        ],
        "defaultContent": []
      },
      {
        "id": "section-4",
        "name": "CTA",
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
