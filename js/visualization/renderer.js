/**
 * DOM Renderer for Algorithm Visualizer
 * Handles rendering array bars, pointer badges, recursion stack frames, status text, and C++ code highlighting.
 */

export class VisualizerRenderer {
  constructor(elements) {
    this.canvas = elements.canvas;
    this.statusBanner = elements.statusBanner;
    this.stepCounter = elements.stepCounter;
    this.comparisonsCounter = elements.comparisonsCounter;
    this.swapsCounter = elements.swapsCounter;
    this.statusBadge = elements.statusBadge;
    this.progressBar = elements.progressBar;
    this.codeContainer = elements.codeContainer;
    this.swapsLabel = elements.swapsLabel || null;
  }

  /**
   * Render a visualization step
   * @param {Object} step 
   * @param {string} algorithmId 
   */
  renderStep(step, algorithmId) {
    if (!step) return;

    // Update status narrative text
    if (this.statusBanner) {
      this.statusBanner.textContent = step.description || '';
    }

    // Update statistics HUD
    this.updateStats(step.stats, algorithmId);

    // Render based on algorithm type
    if (step.type === 'recursion') {
      this.renderRecursion(step);
    } else {
      this.renderArrayBars(step);
    }

    // Update C++ Code line highlight
    this.highlightCodeLine(step.codeLine);
  }

  /**
   * Render array as vertical bars with values, indices, and pointer labels
   * @param {Object} step 
   */
  renderArrayBars(step) {
    const arr = step.array || [];
    const highlights = step.highlights || {};
    const pointers = step.pointers || {};
    const maxVal = Math.max(...arr, 1);

    // Clear canvas
    this.canvas.innerHTML = '';
    this.canvas.className = 'visualizer-canvas array-mode';

    const barContainer = document.createElement('div');
    barContainer.className = 'bars-wrapper';

    // Calculate bar width based on array size
    const n = arr.length;
    let barWidthClass = 'bar-md';
    if (n > 25) barWidthClass = 'bar-sm';
    else if (n > 35) barWidthClass = 'bar-xs';
    else if (n <= 10) barWidthClass = 'bar-lg';

    arr.forEach((value, index) => {
      const barItem = document.createElement('div');
      barItem.className = `bar-item ${barWidthClass}`;
      barItem.id = `bar-item-${index}`;

      // Highlight class
      const state = highlights[index] || 'default';
      barItem.classList.add(`state-${state}`);

      // Height calculation (scale between 18% and 94% of container height)
      const heightPercent = Math.max(14, Math.round((value / maxVal) * 88));

      // Pointer badge (if any)
      const pointerText = pointers[index];
      const pointerElem = document.createElement('div');
      pointerElem.className = 'bar-pointer';
      if (pointerText) {
        pointerElem.textContent = pointerText;
        pointerElem.classList.add('active');
        if (typeof pointerText === 'string') {
          if (pointerText.toLowerCase().includes('pivot')) pointerElem.classList.add('ptr-pivot');
          else if (pointerText.toLowerCase().includes('min')) pointerElem.classList.add('ptr-min');
          else if (pointerText.toLowerCase().includes('found')) pointerElem.classList.add('ptr-found');
          else if (pointerText.toLowerCase().includes('low') || pointerText.toLowerCase().includes('l')) pointerElem.classList.add('ptr-bound');
          else if (pointerText.toLowerCase().includes('high') || pointerText.toLowerCase().includes('r')) pointerElem.classList.add('ptr-bound');
        }
      }

      // Bar pillar
      const barPillar = document.createElement('div');
      barPillar.className = 'bar-pillar';
      barPillar.style.height = `${heightPercent}%`;

      // Value label (top of bar or inside)
      const valLabel = document.createElement('span');
      valLabel.className = 'bar-value';
      valLabel.textContent = value;
      barPillar.appendChild(valLabel);

      // Index label (bottom of bar)
      const idxLabel = document.createElement('span');
      idxLabel.className = 'bar-index';
      idxLabel.textContent = index;

      barItem.appendChild(pointerElem);
      barItem.appendChild(barPillar);
      barItem.appendChild(idxLabel);

      barContainer.appendChild(barItem);
    });

    this.canvas.appendChild(barContainer);
  }

  /**
   * Render Recursion Call Stack visualizer
   * @param {Object} step 
   */
  renderRecursion(step) {
    this.canvas.innerHTML = '';
    this.canvas.className = 'visualizer-canvas recursion-mode';

    const recursionWrapper = document.createElement('div');
    recursionWrapper.className = 'recursion-wrapper';

    // Left Column: The Visual Call Stack (LIFO container)
    const stackContainer = document.createElement('div');
    stackContainer.className = 'recursion-stack-box';

    const stackHeader = document.createElement('div');
    stackHeader.className = 'recursion-stack-header';
    stackHeader.innerHTML = `
      <div class="stack-title">
        <span class="stack-icon">📚</span>
        <span>Call Stack (LIFO)</span>
      </div>
      <span class="stack-depth-badge">Depth: ${step.stack.length}</span>
    `;
    stackContainer.appendChild(stackHeader);

    const stackList = document.createElement('div');
    stackList.className = 'recursion-stack-list';

    if (step.stack.length === 0) {
      if (step.phase === 'complete') {
        const emptyState = document.createElement('div');
        emptyState.className = 'stack-empty completed';
        emptyState.innerHTML = `
          <div class="complete-badge">✨ All Frames Resolved</div>
          <div class="complete-result">factorial(${step.targetN}) = <strong>${step.finalResult}</strong></div>
        `;
        stackList.appendChild(emptyState);
      } else {
        const emptyState = document.createElement('div');
        emptyState.className = 'stack-empty';
        emptyState.textContent = 'Stack is empty. Ready to push initial frame.';
        stackList.appendChild(emptyState);
      }
    } else {
      // Stack displayed from top (most recent frame) to bottom
      // So render in reverse of array order
      for (let i = step.stack.length - 1; i >= 0; i--) {
        const frame = step.stack[i];
        const isTop = (i === step.stack.length - 1);

        const frameItem = document.createElement('div');
        frameItem.className = `stack-frame frame-state-${frame.status} ${isTop ? 'frame-top' : ''}`;

        frameItem.innerHTML = `
          <div class="frame-header">
            <span class="frame-name">${frame.name}</span>
            <span class="frame-tag ${frame.status}">${frame.status.toUpperCase()}</span>
          </div>
          <div class="frame-body">
            <div class="frame-param"><code>n = ${frame.n}</code></div>
            <div class="frame-expr">${frame.expression}</div>
            ${frame.returnVal !== null ? `<div class="frame-return">↪ Returns: <strong>${frame.returnVal}</strong></div>` : ''}
          </div>
        `;
        stackList.appendChild(frameItem);
      }
    }

    stackContainer.appendChild(stackList);
    recursionWrapper.appendChild(stackContainer);

    // Right Column: Unwinding & Execution Tree Overview
    const infoContainer = document.createElement('div');
    infoContainer.className = 'recursion-tree-box';

    const n = step.targetN;
    let treeHTML = `<div class="rec-overview-header"><h4>Execution Unwinding Flow</h4></div><div class="rec-steps-list">`;
    for (let k = n; k >= 1; k--) {
      const isBase = k === 1;
      const stepClass = k <= (n - step.stack.length + 1) ? 'done' : 'pending';
      treeHTML += `
        <div class="rec-step-item ${stepClass}">
          <span class="rec-n-badge">n=${k}</span>
          <span class="rec-call">${isBase ? 'factorial(1) = 1 (Base Case)' : `factorial(${k}) = ${k} × factorial(${k - 1})`}</span>
        </div>
      `;
    }
    treeHTML += `</div>`;
    infoContainer.innerHTML = treeHTML;

    recursionWrapper.appendChild(infoContainer);
    this.canvas.appendChild(recursionWrapper);
  }

  /**
   * Update statistics display
   * @param {Object} stats 
   * @param {string} algorithmId 
   */
  updateStats(stats = {}, algorithmId) {
    if (this.stepCounter && stats.stepNumber !== undefined && stats.totalSteps !== undefined) {
      this.stepCounter.textContent = `${stats.stepNumber} / ${stats.totalSteps}`;
    }

    if (this.progressBar && stats.stepNumber !== undefined && stats.totalSteps !== undefined) {
      const percent = (stats.stepNumber / stats.totalSteps) * 100;
      this.progressBar.value = stats.stepNumber;
      this.progressBar.max = stats.totalSteps;
    }

    if (algorithmId === 'recursion') {
      if (this.comparisonsCounter) this.comparisonsCounter.textContent = stats.calls || 0;
      if (this.swapsCounter) this.swapsCounter.textContent = stats.maxDepth || 0;
      if (this.swapsLabel) this.swapsLabel.textContent = 'Max Depth';
    } else {
      if (this.comparisonsCounter) this.comparisonsCounter.textContent = stats.comparisons || 0;
      if (this.swapsCounter) this.swapsCounter.textContent = stats.swaps || 0;
      if (this.swapsLabel) {
        if (algorithmId === 'merge-sort') this.swapsLabel.textContent = 'Writes';
        else if (algorithmId === 'insertion-sort') this.swapsLabel.textContent = 'Shifts';
        else if (algorithmId.includes('search')) this.swapsLabel.textContent = 'Eliminations';
        else this.swapsLabel.textContent = 'Swaps';
      }
    }

    if (this.statusBadge) {
      const status = stats.status || 'idle';
      this.statusBadge.textContent = status.toUpperCase();
      this.statusBadge.className = `status-badge badge-${status}`;
    }
  }

  /**
   * Highlight active C++ code line
   * @param {number} lineNum 1-indexed
   */
  highlightCodeLine(lineNum) {
    if (!this.codeContainer) return;
    const lines = this.codeContainer.querySelectorAll('.code-line');
    lines.forEach((line, index) => {
      if (index + 1 === lineNum) {
        line.classList.add('active-code-line');
        // Scroll ONLY inside the code box if it overflows, NEVER scrolling the main window/page
        const container = this.codeContainer;
        const lineTop = line.offsetTop - container.offsetTop;
        const lineBottom = lineTop + line.offsetHeight;
        if (lineTop < container.scrollTop) {
          container.scrollTop = lineTop;
        } else if (lineBottom > container.scrollTop + container.clientHeight) {
          container.scrollTop = lineBottom - container.clientHeight;
        }
      } else {
        line.classList.remove('active-code-line');
      }
    });
  }

  /**
   * Load and render C++ code with syntax highlighting
   * @param {string} rawCode 
   */
  renderCppCode(rawCode) {
    if (!this.codeContainer) return;
    this.codeContainer.innerHTML = '';

    const lines = rawCode.split('\n');
    lines.forEach((lineText, idx) => {
      const lineElem = document.createElement('div');
      lineElem.className = 'code-line';
      lineElem.dataset.lineNumber = idx + 1;

      const numSpan = document.createElement('span');
      numSpan.className = 'line-number';
      numSpan.textContent = idx + 1;

      const textSpan = document.createElement('span');
      textSpan.className = 'line-content';
      textSpan.innerHTML = this.highlightCppSyntax(lineText);

      lineElem.appendChild(numSpan);
      lineElem.appendChild(textSpan);
      this.codeContainer.appendChild(lineElem);
    });
  }

  /**
   * Lightweight syntax highlighter for C++ keywords, types, and comments
   * @param {string} line 
   * @returns {string}
   */
  highlightCppSyntax(line) {
    if (!line) return '&nbsp;';

    let escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Single line comments
    if (escaped.includes('//')) {
      const parts = escaped.split('//');
      return `${this.highlightCppTokens(parts[0])}<span class="token-comment">//${parts.slice(1).join('//')}</span>`;
    }

    return this.highlightCppTokens(escaped);
  }

  highlightCppTokens(text) {
    const keywords = ['void', 'int', 'bool', 'for', 'while', 'if', 'else', 'return', 'break', 'std::swap'];
    let highlighted = text;

    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="token-keyword">${kw}</span>`);
    });

    // Numbers
    highlighted = highlighted.replace(/\b([0-9]+)\b/g, '<span class="token-number">$1</span>');

    return highlighted;
  }
}
