/**
 * Main Application Orchestrator for Algorithm Visualizer
 * Connects Step Generators, VisualizerRenderer, AnimationController, and VisualizerControls.
 */

import { ALGORITHM_INFO } from './utils/algorithmInfo.js';
import { isSortedAscending, generateRandomArray } from './utils/helpers.js';

// Algorithms
import { generateLinearSearchSteps } from './algorithms/linearSearch.js';
import { generateBinarySearchSteps } from './algorithms/binarySearch.js';
import { generateBubbleSortSteps } from './algorithms/bubbleSort.js';
import { generateSelectionSortSteps } from './algorithms/selectionSort.js';
import { generateInsertionSortSteps } from './algorithms/insertionSort.js';
import { generateMergeSortSteps } from './algorithms/mergeSort.js';
import { generateQuickSortSteps } from './algorithms/quickSort.js';
import { generateRecursionSteps } from './algorithms/recursion.js';

// Visualization
import { VisualizerRenderer } from './visualization/renderer.js';
import { AnimationController } from './visualization/animation.js';
import { VisualizerControls } from './visualization/controls.js';

class AlgorithmVisualizerApp {
  constructor() {
    this.currentAlgorithmId = 'bubble-sort';
    this.currentArray = [45, 12, 85, 32, 89, 39, 69, 22, 58, 74, 15, 96];
    this.currentTarget = 39;
    this.currentRecursionN = 5;

    this.initDOMReferences();
    this.initRenderer();
    this.initAnimationEngine();
    this.initControls();
    this.initSidebarAndNavigation();
    this.initThemeManager();
    this.initKeyboardShortcuts();

    // Bootstrap initial algorithm
    this.selectAlgorithm('bubble-sort');
  }

  /**
   * Cache all DOM elements
   */
  initDOMReferences() {
    this.dom = {
      // Header & Navigation
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      themeLabel: document.getElementById('theme-label'),
      sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
      sidebar: document.getElementById('app-sidebar'),
      sidebarBackdrop: document.getElementById('sidebar-backdrop'),
      navButtons: document.querySelectorAll('.nav-item-btn'),

      // Algorithm Header Info
      algoCategoryBadge: document.getElementById('algo-category-badge'),
      algoTitle: document.getElementById('algo-title'),
      algoDescription: document.getElementById('algo-description'),
      algoQuickTraits: document.getElementById('algo-quick-traits'),
      sortWarning: document.getElementById('sort-warning'),
      alertSortBtn: document.getElementById('alert-sort-btn'),

      // Canvas Arena
      statusBanner: document.getElementById('status-banner'),
      canvas: document.getElementById('visualizer-canvas'),
      timelineSlider: document.getElementById('timeline-slider'),
      stepCounter: document.getElementById('stat-step'),
      comparisonsCounter: document.getElementById('stat-comparisons'),
      swapsCounter: document.getElementById('stat-swaps'),
      swapsLabel: document.getElementById('stat-swaps-label'),
      statusBadge: document.getElementById('stat-status-badge'),

      // Primary Controls
      playBtn: document.getElementById('btn-play'),
      prevBtn: document.getElementById('btn-prev'),
      nextBtn: document.getElementById('btn-next'),
      resetBtn: document.getElementById('btn-reset'),
      speedButtons: document.querySelectorAll('.speed-btn'),

      // Array Inputs
      arrayControlsPanel: document.getElementById('array-controls-panel'),
      randomBtn: document.getElementById('btn-random'),
      shuffleBtn: document.getElementById('btn-shuffle'),
      sortBtn: document.getElementById('btn-sort'),
      sizeSlider: document.getElementById('array-size-slider'),
      sizeValueLabel: document.getElementById('size-value-label'),
      customArrayForm: document.getElementById('custom-array-form'),
      customArrayInput: document.getElementById('custom-array-input'),
      applyCustomArrayBtn: document.getElementById('btn-apply-custom'),
      customArrayError: document.getElementById('custom-array-error'),

      // Search Inputs
      targetControlGroup: document.getElementById('target-control-group'),
      targetInput: document.getElementById('target-input'),
      pickTargetBtn: document.getElementById('btn-pick-target'),

      // Recursion Inputs
      recursionControlsPanel: document.getElementById('recursion-controls-panel'),
      recursionNInput: document.getElementById('recursion-n-input'),
      recursionNLabel: document.getElementById('recursion-n-label'),

      // Details Panel
      howItWorksList: document.getElementById('how-it-works-list'),
      compBest: document.getElementById('comp-best'),
      compAvg: document.getElementById('comp-avg'),
      compWorst: document.getElementById('comp-worst'),
      compSpace: document.getElementById('comp-space'),
      characteristicsGrid: document.getElementById('characteristics-grid'),

      // C++ Code Panel
      codeContainer: document.getElementById('cpp-code-container')
    };
  }

  /**
   * Initialize Renderer
   */
  initRenderer() {
    this.renderer = new VisualizerRenderer({
      canvas: this.dom.canvas,
      statusBanner: this.dom.statusBanner,
      stepCounter: this.dom.stepCounter,
      comparisonsCounter: this.dom.comparisonsCounter,
      swapsCounter: this.dom.swapsCounter,
      swapsLabel: this.dom.swapsLabel,
      statusBadge: this.dom.statusBadge,
      progressBar: this.dom.timelineSlider,
      codeContainer: this.dom.codeContainer
    });
  }

  /**
   * Initialize Animation Engine
   */
  initAnimationEngine() {
    this.animation = new AnimationController({
      onStepChange: (step, index, total) => {
        this.renderer.renderStep(step, this.currentAlgorithmId);
        if (this.dom.timelineSlider) {
          this.dom.timelineSlider.value = index + 1;
        }
      },
      onComplete: () => {
        this.controls.setPlayState(false);
      },
      onStateChange: ({ isPlaying, isFinished }) => {
        this.controls.setPlayState(isPlaying);
      }
    });
  }

  /**
   * Initialize Toolbar Controls
   */
  initControls() {
    this.controls = new VisualizerControls({
      elements: this.dom,
      animation: this.animation,
      onArrayChange: (newArray) => {
        this.currentArray = [...newArray];
        this.recomputeSteps();
      },
      onTargetChange: (newTarget) => {
        this.currentTarget = newTarget;
        this.recomputeSteps();
      },
      onRecursionNChange: (newN) => {
        this.currentRecursionN = newN;
        this.recomputeSteps();
      },
      onSortArrayRequest: () => {
        this.currentArray.sort((a, b) => a - b);
        this.controls.setArray(this.currentArray, true);
      }
    });

    // Alert Sort button event
    if (this.dom.alertSortBtn) {
      this.dom.alertSortBtn.addEventListener('click', () => {
        this.currentArray.sort((a, b) => a - b);
        this.controls.setArray(this.currentArray, true);
        if (this.dom.sortWarning) this.dom.sortWarning.classList.add('hidden');
      });
    }

    // Set initial custom array input value
    if (this.dom.customArrayInput) {
      this.dom.customArrayInput.value = this.currentArray.join(', ');
    }
  }

  /**
   * Sidebar navigation and mobile menu
   */
  initSidebarAndNavigation() {
    // Algorithm selection from sidebar
    this.dom.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const algoId = btn.dataset.algorithm;
        if (algoId) {
          this.selectAlgorithm(algoId);
          // Close mobile sidebar if open
          this.closeMobileSidebar();
        }
      });
    });

    // Mobile sidebar toggle
    if (this.dom.sidebarToggleBtn) {
      this.dom.sidebarToggleBtn.addEventListener('click', () => {
        this.toggleMobileSidebar();
      });
    }

    if (this.dom.sidebarBackdrop) {
      this.dom.sidebarBackdrop.addEventListener('click', () => {
        this.closeMobileSidebar();
      });
    }
  }

  toggleMobileSidebar() {
    if (this.dom.sidebar) this.dom.sidebar.classList.toggle('open');
    if (this.dom.sidebarBackdrop) this.dom.sidebarBackdrop.classList.toggle('active');
  }

  closeMobileSidebar() {
    if (this.dom.sidebar) this.dom.sidebar.classList.remove('open');
    if (this.dom.sidebarBackdrop) this.dom.sidebarBackdrop.classList.remove('active');
  }

  /**
   * Theme Manager (Dark / Light) with LocalStorage persistence
   */
  initThemeManager() {
    const savedTheme = localStorage.getItem('algo_vis_theme') || 'dark';
    this.applyTheme(savedTheme);

    if (this.dom.themeToggleBtn) {
      this.dom.themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
      });
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('algo_vis_theme', theme);
    if (this.dom.themeLabel) {
      this.dom.themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
  }

  /**
   * Keyboard shortcuts
   */
  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if user is currently typing in an input field
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.animation.togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.animation.pause();
        this.animation.nextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.animation.prevStep();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        this.animation.reset();
      }
    });
  }

  /**
   * Select an algorithm by ID and re-render all panels
   * @param {string} algorithmId 
   */
  selectAlgorithm(algorithmId) {
    const info = ALGORITHM_INFO[algorithmId];
    if (!info) return;

    this.currentAlgorithmId = algorithmId;

    // Update active nav button
    this.dom.navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.algorithm === algorithmId);
    });

    // Update header info
    if (this.dom.algoCategoryBadge) this.dom.algoCategoryBadge.textContent = info.category;
    if (this.dom.algoTitle) this.dom.algoTitle.textContent = info.name;
    if (this.dom.algoDescription) this.dom.algoDescription.textContent = info.shortDescription;

    // Update Quick traits badges
    if (this.dom.algoQuickTraits) {
      this.dom.algoQuickTraits.innerHTML = '';
      if (info.characteristics) {
        info.characteristics.slice(0, 2).forEach(c => {
          const badge = document.createElement('span');
          badge.className = 'trait-badge';
          badge.textContent = `${c.label}: ${c.value}`;
          this.dom.algoQuickTraits.appendChild(badge);
        });
      }
    }

    // Update How It Works list
    if (this.dom.howItWorksList) {
      this.dom.howItWorksList.innerHTML = '';
      info.howItWorks.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        this.dom.howItWorksList.appendChild(li);
      });
    }

    // Update Complexity Table
    if (this.dom.compBest) this.dom.compBest.textContent = info.complexity.timeBest;
    if (this.dom.compAvg) this.dom.compAvg.textContent = info.complexity.timeAvg;
    if (this.dom.compWorst) this.dom.compWorst.textContent = info.complexity.timeWorst;
    if (this.dom.compSpace) this.dom.compSpace.textContent = info.complexity.space;

    // Update Characteristics Grid
    if (this.dom.characteristicsGrid) {
      this.dom.characteristicsGrid.innerHTML = '';
      info.characteristics.forEach(c => {
        const item = document.createElement('div');
        item.className = 'char-item';
        item.innerHTML = `
          <span class="char-label">${c.label}</span>
          <span class="char-val">${c.value}</span>
        `;
        this.dom.characteristicsGrid.appendChild(item);
      });
    }

    // Render C++ Code
    this.renderer.renderCppCode(info.cppCode);

    // If Binary Search, auto-sort current array if not already sorted
    if (algorithmId === 'binary-search' && !isSortedAscending(this.currentArray)) {
      this.currentArray.sort((a, b) => a - b);
      if (this.dom.customArrayInput) this.dom.customArrayInput.value = this.currentArray.join(', ');
    }

    // Target value default sync
    if (algorithmId.includes('search')) {
      if (this.currentArray.length > 0 && !this.currentArray.includes(this.currentTarget)) {
        this.currentTarget = this.currentArray[Math.floor(this.currentArray.length / 2)];
        if (this.dom.targetInput) this.dom.targetInput.value = this.currentTarget;
      }
    }

    // Update controls context
    this.controls.updateAlgorithmContext(algorithmId);

    // Compute steps and load
    this.recomputeSteps();
  }

  /**
   * Recompute step timeline based on current algorithm, array, target or recursion parameters
   */
  recomputeSteps() {
    let steps = [];

    switch (this.currentAlgorithmId) {
      case 'linear-search':
        steps = generateLinearSearchSteps(this.currentArray, this.currentTarget);
        break;

      case 'binary-search':
        // If array is not sorted, sort a copy for safety
        const sortedArr = isSortedAscending(this.currentArray) ? this.currentArray : [...this.currentArray].sort((a, b) => a - b);
        steps = generateBinarySearchSteps(sortedArr, this.currentTarget);
        break;

      case 'bubble-sort':
        steps = generateBubbleSortSteps(this.currentArray);
        break;

      case 'selection-sort':
        steps = generateSelectionSortSteps(this.currentArray);
        break;

      case 'insertion-sort':
        steps = generateInsertionSortSteps(this.currentArray);
        break;

      case 'merge-sort':
        steps = generateMergeSortSteps(this.currentArray);
        break;

      case 'quick-sort':
        steps = generateQuickSortSteps(this.currentArray);
        break;

      case 'recursion':
        steps = generateRecursionSteps(this.currentRecursionN);
        break;

      default:
        steps = generateBubbleSortSteps(this.currentArray);
    }

    // Update timeline slider max value
    if (this.dom.timelineSlider) {
      this.dom.timelineSlider.min = 1;
      this.dom.timelineSlider.max = steps.length;
      this.dom.timelineSlider.value = 1;
    }

    // Load steps into animation controller
    this.animation.loadSteps(steps);
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.algoApp = new AlgorithmVisualizerApp();
});
