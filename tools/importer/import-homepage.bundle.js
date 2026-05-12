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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-trendsetters.js
  function parse(element, { document }) {
    const directChildren = Array.from(element.children).filter((n) => n.nodeType === 1);
    let imageColumn = directChildren.find((child) => child.querySelector('img.cover-image, img[class*="cover"]'));
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
      const paragraphs = Array.from(textColumn.querySelectorAll(":scope > p, :scope > .subheading, :scope p.subheading"));
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
      cells.push([images]);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-trendsetters", cells });
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

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    let cards = Array.from(
      element.querySelectorAll(":scope > .utility-aspect-1x1")
    );
    if (cards.length === 0) {
      cards = Array.from(element.querySelectorAll(".utility-aspect-1x1"));
    }
    if (cards.length === 0) {
      cards = Array.from(element.querySelectorAll(":scope > div")).filter(
        (div) => div.querySelector("img")
      );
    }
    const cells = cards.map((card) => {
      const img = card.querySelector("img");
      return img ? [img] : null;
    }).filter((row) => row !== null);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-gallery",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const buttons = Array.from(
      element.querySelectorAll('.tab-menu .tab-menu-link, [role="tab"], button[data-tab-target]')
    );
    const panels = Array.from(
      element.querySelectorAll('.tabs-content .tab-pane, [role="tabpanel"], .tab-pane[data-tab-index]')
    );
    const uniqueButtons = Array.from(new Set(buttons));
    const uniquePanels = Array.from(new Set(panels));
    const panelByIndex = /* @__PURE__ */ new Map();
    uniquePanels.forEach((panel, i) => {
      var _a;
      const key = (_a = panel.getAttribute("data-tab-index")) != null ? _a : String(i);
      if (!panelByIndex.has(key)) panelByIndex.set(key, panel);
    });
    const cells = [];
    uniqueButtons.forEach((button, i) => {
      var _a;
      const key = (_a = button.getAttribute("data-tab-target")) != null ? _a : String(i);
      const panel = panelByIndex.get(key) || uniquePanels[i];
      const labelCell = [];
      const avatarImg = button.querySelector(".avatar img, img.cover-image, img");
      if (avatarImg) labelCell.push(avatarImg);
      const buttonTextEls = Array.from(
        button.querySelectorAll(":scope .flex-horizontal > div:not(.avatar), :scope > div:not(.avatar)")
      );
      const seenLabel = /* @__PURE__ */ new Set();
      buttonTextEls.forEach((el) => {
        if (el.classList.contains("avatar")) return;
        if (el.classList.contains("flex-horizontal")) return;
        if (seenLabel.has(el)) return;
        seenLabel.add(el);
        labelCell.push(el);
      });
      if (labelCell.length === 0 || labelCell.length === 1 && avatarImg) {
        const fallbackText = (button.textContent || "").trim();
        if (fallbackText) labelCell.push(fallbackText);
      }
      const panelCell = [];
      if (panel) {
        const portrait = panel.querySelector("img.cover-image, img");
        if (portrait) panelCell.push(portrait);
        const nameEl = panel.querySelector(".paragraph-xl strong, strong");
        if (nameEl) {
          panelCell.push(nameEl);
        }
        const nameContainer = nameEl ? nameEl.closest("div") : null;
        if (nameContainer) {
          const roleEl = nameContainer.nextElementSibling;
          if (roleEl && roleEl !== nameContainer) panelCell.push(roleEl);
        }
        const quoteEl = panel.querySelector("p.paragraph-xl, p");
        if (quoteEl) panelCell.push(quoteEl);
      }
      cells.push([labelCell, panelCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
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

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    let items = Array.from(
      element.querySelectorAll(":scope > details.faq-item, :scope > details")
    );
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("details.faq-item, details"));
    }
    const cells = items.map((item) => {
      const summary = item.querySelector("summary.faq-question, summary");
      let questionCell = "";
      if (summary) {
        const qSpan = summary.querySelector("span");
        const qText = (qSpan ? qSpan.textContent : summary.textContent).trim();
        if (qText) {
          const p = document.createElement("p");
          p.textContent = qText;
          questionCell = p;
        }
      }
      const answerWrap = item.querySelector(".faq-answer");
      let answerCell = "";
      if (answerWrap) {
        const children = Array.from(answerWrap.children);
        if (children.length > 0) {
          answerCell = children.length === 1 ? children[0] : children;
        } else {
          const text = answerWrap.textContent.trim();
          if (text) {
            const p = document.createElement("p");
            p.textContent = text;
            answerCell = p;
          }
        }
      }
      return [questionCell, answerCell];
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "accordion-faq",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document }) {
    let card = element;
    if (!card.matches(".utility-position-relative")) {
      const inner = card.querySelector(".utility-position-relative");
      if (inner) card = inner;
    }
    const bgImage = card.querySelector(
      'img.cover-image.utility-overlay, img.cover-image, img[class*="cover-image"], img[class*="background"]'
    );
    const bodyEl = card.querySelector('.card-body, [class*="card-body"]') || (card !== element ? card : element);
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
      const seen = /* @__PURE__ */ new Set();
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
    const heading = queryFirst('h1, h2, .h1-heading, .h2-heading, [class*="heading"]') || queryFirst("h3");
    const paragraphs = queryAll("p.subheading, p.paragraph-lg, p.paragraph-sm, p");
    const ctaLinks = queryAll(".button-group a, a.button");
    const textCell = [];
    if (heading) textCell.push(heading);
    const seenP = /* @__PURE__ */ new Set();
    paragraphs.forEach((p) => {
      if (!seenP.has(p)) {
        seenP.add(p);
        textCell.push(p);
      }
    });
    const seenA = /* @__PURE__ */ new Set();
    ctaLinks.forEach((a) => {
      if (!seenA.has(a)) {
        seenA.add(a);
        textCell.push(a);
      }
    });
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-trendsetters": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
