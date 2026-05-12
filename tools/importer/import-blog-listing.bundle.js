/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-blog-listing.js
  var import_blog_listing_exports = {};
  __export(import_blog_listing_exports, {
    default: () => import_blog_listing_default
  });

  // tools/importer/parsers/hero-blog.js
  function parse(element, { document }) {
    const directChildren = Array.from(element.children).filter((n) => n.nodeType === 1);
    let imageColumn = directChildren.find((child) => child.querySelector('img.cover-image, img[class*="cover"], img'));
    let textColumn = directChildren.find((child) => child !== imageColumn);
    if (!imageColumn) {
      imageColumn = element.querySelector('.grid-layout.grid-gap-xs, .grid-layout[class*="grid-gap-xs"]');
    }
    if (!textColumn) {
      textColumn = element.querySelector(":scope > div:not(.grid-layout)") || directChildren.find((child) => child.querySelector("h1, h2, h3, .h1-heading, .h2-heading"));
    }
    const imageEls = imageColumn ? Array.from(imageColumn.querySelectorAll('img.cover-image, img[class*="cover-image"], img')) : [];
    const images = Array.from(new Set(imageEls));
    const textCell = [];
    if (textColumn) {
      const heading = textColumn.querySelector('h1, h2, h3, .h1-heading, .h2-heading, [class*="heading"]');
      if (heading) textCell.push(heading);
      const paragraphs = Array.from(
        textColumn.querySelectorAll(":scope > p, :scope > .subheading, :scope p.subheading")
      );
      const seenP = /* @__PURE__ */ new Set();
      paragraphs.forEach((p) => {
        if (!seenP.has(p)) {
          seenP.add(p);
          textCell.push(p);
        }
      });
      const ctaLinks = Array.from(
        textColumn.querySelectorAll('.button-group a, a.button, a[class*="button"]')
      );
      const seenA = /* @__PURE__ */ new Set();
      ctaLinks.forEach((a) => {
        if (!seenA.has(a)) {
          seenA.add(a);
          textCell.push(a);
        }
      });
    }
    const cells = [];
    if (images.length > 0) {
      cells.push([images.length === 1 ? images[0] : images]);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-blog", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const columnEls = Array.from(element.children).filter((child) => child.tagName === "DIV");
    let columns = columnEls;
    if (columns.length < 2) {
      const innerGrid = element.querySelector(":scope .grid-layout, :scope > .grid-layout");
      if (innerGrid) {
        columns = Array.from(innerGrid.children).filter((child) => child.tagName === "DIV");
      }
    }
    const contentRow = columns.map((col) => col);
    const cells = [contentRow];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-article",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document }) {
    let cards = Array.from(
      element.querySelectorAll(":scope > a.article-card, :scope > a.card-link")
    );
    if (cards.length === 0) {
      cards = Array.from(element.querySelectorAll("a.article-card"));
    }
    const cells = cards.map((card) => {
      const href = card.getAttribute("href");
      const img = card.querySelector(".article-card-image img, img");
      const body = card.querySelector(".article-card-body") || card;
      const tag = body.querySelector(".tag");
      const date = body.querySelector(
        ".article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)"
      );
      const heading = body.querySelector("h2, h3, h4, h5, h6");
      const imageCell = img || "";
      const textCell = [];
      if (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag.textContent.trim();
        textCell.push(tagP);
      }
      if (heading) {
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading.textContent.trim();
          const h = document.createElement(heading.tagName);
          h.appendChild(link);
          textCell.push(h);
        } else {
          textCell.push(heading);
        }
      } else if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = href;
        textCell.push(link);
      }
      if (date) {
        const dateP = document.createElement("p");
        dateP.textContent = date.textContent.trim();
        textCell.push(dateP);
      }
      return [imageCell, textCell];
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-article",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "#nav-toggle",
        ".nav-mobile-menu-button",
        "footer.footer",
        "footer.inverse-footer"
      ]);
      element.querySelectorAll('img[src^="data:image/svg+xml;base64,"]').forEach((img) => {
        img.remove();
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "#nav-toggle",
        ".nav-mobile-menu-button",
        "footer.footer",
        "footer.inverse-footer",
        "iframe",
        "noscript",
        "link",
        "script",
        "style"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid-")) {
            el.removeAttribute(attr.name);
          }
        });
      });
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.startsWith("data:image/svg+xml;base64,")) {
          img.remove();
        }
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      const sections = template && Array.isArray(template.sections) ? template.sections : [];
      if (sections.length < 2) {
        return;
      }
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.selector) {
          continue;
        }
        let sectionEl = null;
        try {
          sectionEl = element.querySelector(section.selector);
        } catch (e) {
          sectionEl = null;
        }
        if (!sectionEl && document) {
          try {
            sectionEl = document.querySelector(section.selector);
          } catch (e) {
            sectionEl = null;
          }
        }
        if (!sectionEl) {
          continue;
        }
        if (section.style) {
          const cells = [
            ["Section Metadata"],
            ["style", section.style]
          ];
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          }) || WebImporter.DOMUtils.createTable(cells, document);
          if (metadataBlock) {
            sectionEl.append(metadataBlock);
          }
        }
        if (i > 0 && sectionEl.parentNode) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-blog-listing.js
  var parsers = {
    "hero-blog": parse,
    "columns-article": parse2,
    "cards-article": parse3
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
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
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_blog_listing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let rawPath = new URL(params.originalURL).pathname.replace(/\.html$/, "");
      if (rawPath === "" || rawPath === "/") rawPath = "/index";
      else rawPath = rawPath.replace(/\/$/, "");
      const sanitizedPath = WebImporter.FileUtils.sanitizePath(rawPath);
      return [{
        element: main,
        path: sanitizedPath,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_blog_listing_exports);
})();
