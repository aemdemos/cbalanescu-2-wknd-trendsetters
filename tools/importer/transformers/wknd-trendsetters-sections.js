/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section boundaries & section-metadata.
 *
 * Runs in afterTransform only. Reads the section definitions from
 * `payload.template.sections` (populated by page-templates.json) and, for
 * each section:
 *   - When section.style is set, inserts a "Section Metadata" block (table)
 *     at the end of the section so the importer renders the section-metadata
 *     block in the generated document.
 *   - When the section is not the first, inserts an <hr> before the section
 *     element to mark the section break.
 *
 * Sections are processed in reverse order so DOM insertions done later
 * cannot shift earlier indices / selectors. Every section selector comes
 * from the template definitions in tools/importer/page-templates.json,
 * which in turn were produced from the captured DOM of the site.
 *
 * Reference: https://www.aem.live/developer/block-collection/section-metadata
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];

    if (sections.length < 2) {
      return;
    }

    // The importer hands us the <main> equivalent as `element`, but the
    // Section Metadata block factory needs a document reference. Pick up the
    // owner document from the element itself.
    const document = element.ownerDocument;

    // Process in reverse so earlier sections' selectors aren't shifted by
    // later DOM mutations.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) {
        continue;
      }

      // Resolve the section element. Selectors in page-templates.json are
      // rooted at <main>/<body>, so first try the importer's root element
      // and fall back to the document root.
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

      // Append Section Metadata block inside the section when a style is set.
      if (section.style) {
        const cells = [
          ['Section Metadata'],
          ['style', section.style],
        ];
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        }) || WebImporter.DOMUtils.createTable(cells, document);
        if (metadataBlock) {
          sectionEl.append(metadataBlock);
        }
      }

      // For every section except the first, insert a <hr> before the section
      // to mark the section break in the generated document.
      if (i > 0 && sectionEl.parentNode) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
