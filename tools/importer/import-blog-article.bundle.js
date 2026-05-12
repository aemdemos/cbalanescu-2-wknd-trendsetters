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

  // tools/importer/import-blog-article.js
  var import_blog_article_exports = {};
  __export(import_blog_article_exports, {
    default: () => import_blog_article_default
  });

  // tools/importer/parsers/hero-blog-post.js
  function parse(element, { document }) {
    const directChildren = Array.from(element.children).filter((n) => n.nodeType === 1);
    let imageColumn = directChildren.find((child) => child.querySelector('img.cover-image, img[class*="cover"], img'));
    let textColumn = directChildren.find((child) => child !== imageColumn);
    if (!imageColumn) {
      imageColumn = element.querySelector(":scope > div:has(img), :scope > div img") ? element.querySelector(":scope > div") : null;
    }
    if (!textColumn) {
      textColumn = directChildren.find((child) => child.querySelector("h1, h2, .breadcrumbs, .tag")) || element.querySelector(":scope > div:not(:has(img))");
    }
    const imageEls = imageColumn ? Array.from(imageColumn.querySelectorAll('img.cover-image, img[class*="cover-image"], img')) : [];
    const images = Array.from(new Set(imageEls));
    const textCell = [];
    if (textColumn) {
      const breadcrumbs = textColumn.querySelector(":scope > .breadcrumbs, .breadcrumbs");
      if (breadcrumbs) textCell.push(breadcrumbs);
      const heading = textColumn.querySelector("h1, h2, .h1-heading, .h2-heading");
      if (heading) textCell.push(heading);
      let bylineWrapper = null;
      const textColumnChildren = Array.from(textColumn.children).filter((n) => n.nodeType === 1);
      for (const child of textColumnChildren) {
        if (child === breadcrumbs) continue;
        if (child.classList && child.classList.contains("tag")) continue;
        if (child.tagName === "H1" || child.tagName === "H2" || child.tagName === "H3") continue;
        if (child.querySelector(".flex-horizontal")) {
          bylineWrapper = child;
          break;
        }
      }
      if (bylineWrapper) {
        textCell.push(bylineWrapper);
      } else {
        const flexRows = Array.from(textColumn.querySelectorAll(":scope > .flex-horizontal"));
        flexRows.forEach((row) => textCell.push(row));
      }
      const tag = textColumn.querySelector(":scope > .tag, .tag");
      if (tag) textCell.push(tag);
    }
    const cells = [];
    if (images.length > 0) {
      cells.push([images.length === 1 ? images[0] : images]);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-blog-post", cells });
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

  // tools/importer/import-blog-article.js
  var parsers = {
    "hero-blog-post": parse
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
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
  var import_blog_article_default = {
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
  return __toCommonJS(import_blog_article_exports);
})();
