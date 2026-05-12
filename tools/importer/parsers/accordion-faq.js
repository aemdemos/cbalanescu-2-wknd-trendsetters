/* eslint-disable */
/* global WebImporter */
/**
 * Parser: accordion-faq
 * Base block: accordion (doc project – block table with first row = block name,
 *   each subsequent row = one accordion item with two cells: question | answer).
 *
 * accordion-faq renders an FAQ list: a stack of expandable question/answer
 * items. Each item displays a question (with an expand/collapse icon) and,
 * when open, reveals the answer content.
 *
 * Source selector (from page-templates.json): .faq-list
 * Source URL examples:
 *   - https://wknd-trendsetters.pages.dev/        (Homepage FAQ section)
 *   - https://wknd-trendsetters.pages.dev/faq     (FAQ page)
 *
 * Source DOM (per FAQ item):
 *   <details class="faq-item">
 *     <summary class="faq-question">
 *       <span>QUESTION TEXT</span>
 *       <img src="..."> <!-- plus/minus icon, discarded -->
 *     </summary>
 *     <div class="faq-answer">
 *       <p>ANSWER TEXT</p>
 *     </div>
 *   </details>
 *
 * Output table:
 *   | accordion-faq |            |
 *   | question 1    | answer 1   |
 *   | question 2    | answer 2   |
 *   | ...           | ...        |
 */
export default function parse(element, { document }) {
  // Collect all FAQ items. Prefer direct children of the faq-list; fall back
  // to any descendant <details> if the element wraps the list.
  let items = Array.from(
    element.querySelectorAll(':scope > details.faq-item, :scope > details'),
  );
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('details.faq-item, details'));
  }

  // Build one row per FAQ item with exactly two cells: question | answer.
  const cells = items.map((item) => {
    // Question: prefer the inner <span> text inside the summary (the icon
    // <img> sits alongside it and must not be carried into the cell).
    const summary = item.querySelector('summary.faq-question, summary');
    let questionCell = '';
    if (summary) {
      const qSpan = summary.querySelector('span');
      const qText = (qSpan ? qSpan.textContent : summary.textContent).trim();
      if (qText) {
        const p = document.createElement('p');
        p.textContent = qText;
        questionCell = p;
      }
    }

    // Answer: the entire faq-answer wrapper content (preserves <p>, links,
    // lists, or any rich content authors may add later).
    const answerWrap = item.querySelector('.faq-answer');
    let answerCell = '';
    if (answerWrap) {
      const children = Array.from(answerWrap.children);
      if (children.length > 0) {
        answerCell = children.length === 1 ? children[0] : children;
      } else {
        const text = answerWrap.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          answerCell = p;
        }
      }
    }

    return [questionCell, answerCell];
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'accordion-faq',
    cells,
  });

  element.replaceWith(block);
}
