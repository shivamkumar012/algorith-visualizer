/**
 * Controls Toolbar and Input Panel Handler
 * Manages event listeners for playback buttons, array generation, sliders, speed controls,
 * custom input parsing, and algorithm configuration.
 */

import { generateRandomArray, shuffleArray, parseCustomArray, isSortedAscending } from '../utils/helpers.js';

export class VisualizerControls {
  constructor({
    elements,
    animation,
    onArrayChange,
    onTargetChange,
    onRecursionNChange,
    onSortArrayRequest
  }) {
    this.elements = elements;
    this.animation = animation;
    this.onArrayChange = onArrayChange;
    this.onTargetChange = onTargetChange;
    this.onRecursionNChange = onRecursionNChange;
    this.onSortArrayRequest = onSortArrayRequest;

    this.currentArray = [];
    this.currentAlgorithmId = 'bubble-sort';
    this.currentTarget = 25;
    this.currentRecursionN = 5;

    this.initEventListeners();
  }

  /**
   * Initialize all event listeners
   */
  initEventListeners() {
    const el = this.elements;

    // Play/Pause Button
    if (el.playBtn) {
      el.playBtn.addEventListener('click', () => {
        this.animation.togglePlayPause();
      });
    }

    // Next Step Button
    if (el.nextBtn) {
      el.nextBtn.addEventListener('click', () => {
        this.animation.pause();
        this.animation.nextStep();
      });
    }

    // Previous Step Button
    if (el.prevBtn) {
      el.prevBtn.addEventListener('click', () => {
        this.animation.prevStep();
      });
    }

    // Reset Button
    if (el.resetBtn) {
      el.resetBtn.addEventListener('click', () => {
        this.animation.reset();
      });
    }

    // Scrubber / Progress bar range
    if (el.timelineSlider) {
      el.timelineSlider.addEventListener('input', (e) => {
        const stepIdx = parseInt(e.target.value, 10) - 1;
        this.animation.goToStep(stepIdx);
      });
    }

    // Speed preset buttons
    if (el.speedButtons) {
      el.speedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          el.speedButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const speed = parseInt(btn.dataset.speed, 10);
          this.animation.setSpeed(speed);
        });
      });
    }

    // Array Size Slider
    if (el.sizeSlider) {
      el.sizeSlider.addEventListener('input', (e) => {
        const size = parseInt(e.target.value, 10);
        if (el.sizeValueLabel) el.sizeValueLabel.textContent = size;
        this.generateNewRandomArray(size);
      });
    }

    // Generate Random Array Button
    if (el.randomBtn) {
      el.randomBtn.addEventListener('click', () => {
        const size = el.sizeSlider ? parseInt(el.sizeSlider.value, 10) : 12;
        this.generateNewRandomArray(size);
      });
    }

    // Shuffle Array Button
    if (el.shuffleBtn) {
      el.shuffleBtn.addEventListener('click', () => {
        if (this.currentArray.length > 0) {
          const shuffled = shuffleArray(this.currentArray);
          this.setArray(shuffled, true);
        }
      });
    }

    // Sort Array Button (Useful for Binary Search)
    if (el.sortBtn) {
      el.sortBtn.addEventListener('click', () => {
        if (this.onSortArrayRequest) {
          this.onSortArrayRequest();
        }
      });
    }

    // Custom Array Input Form
    if (el.customArrayForm) {
      el.customArrayForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.applyCustomArray();
      });
    }

    if (el.applyCustomArrayBtn) {
      el.applyCustomArrayBtn.addEventListener('click', () => {
        this.applyCustomArray();
      });
    }

    // Target Value Input (Searching)
    if (el.targetInput) {
      el.targetInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
          this.currentTarget = val;
          if (this.onTargetChange) this.onTargetChange(val);
        }
      });
    }

    // Pick Random Target from Array
    if (el.pickTargetBtn) {
      el.pickTargetBtn.addEventListener('click', () => {
        if (this.currentArray.length > 0) {
          const randomVal = this.currentArray[Math.floor(Math.random() * this.currentArray.length)];
          if (el.targetInput) el.targetInput.value = randomVal;
          this.currentTarget = randomVal;
          if (this.onTargetChange) this.onTargetChange(randomVal);
        }
      });
    }

    // Recursion N Input
    if (el.recursionNInput) {
      el.recursionNInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 5;
        val = Math.max(1, Math.min(8, val));
        if (el.recursionNLabel) el.recursionNLabel.textContent = val;
        this.currentRecursionN = val;
        if (this.onRecursionNChange) this.onRecursionNChange(val);
      });
    }
  }

  /**
   * Generate and apply new random array
   * @param {number} size 
   */
  generateNewRandomArray(size = 12) {
    let arr = generateRandomArray(size, 5, 95);
    // If current algorithm is binary search, sort it
    if (this.currentAlgorithmId === 'binary-search') {
      arr.sort((a, b) => a - b);
    }
    this.setArray(arr, true);
  }

  /**
   * Apply custom array from input field
   */
  applyCustomArray() {
    const el = this.elements;
    if (!el.customArrayInput) return;

    const parsed = parseCustomArray(el.customArrayInput.value, 1, 100, 40);
    if (!parsed.valid) {
      this.showInputError(parsed.error || 'Invalid array input');
      return;
    }

    this.clearInputError();
    let data = parsed.data;

    // Check if binary search requires sorted
    if (this.currentAlgorithmId === 'binary-search' && !isSortedAscending(data)) {
      if (el.sortWarning) {
        el.sortWarning.classList.remove('hidden');
      }
    } else {
      if (el.sortWarning) {
        el.sortWarning.classList.add('hidden');
      }
    }

    if (el.sizeSlider) {
      el.sizeSlider.value = data.length;
      if (el.sizeValueLabel) el.sizeValueLabel.textContent = data.length;
    }

    this.setArray(data, true);
  }

  showInputError(msg) {
    const el = this.elements;
    if (el.customArrayError) {
      el.customArrayError.textContent = msg;
      el.customArrayError.classList.remove('hidden');
    }
  }

  clearInputError() {
    const el = this.elements;
    if (el.customArrayError) {
      el.customArrayError.textContent = '';
      el.customArrayError.classList.add('hidden');
    }
  }

  /**
   * Update internal array and notify
   */
  setArray(arr, notify = true) {
    this.currentArray = [...arr];
    if (this.elements.customArrayInput) {
      this.elements.customArrayInput.value = arr.join(', ');
    }
    if (notify && this.onArrayChange) {
      this.onArrayChange(this.currentArray);
    }
  }

  /**
   * Update UI state based on selected algorithm
   * @param {string} algorithmId 
   */
  updateAlgorithmContext(algorithmId) {
    this.currentAlgorithmId = algorithmId;
    const isSearching = algorithmId.includes('search');
    const isBinarySearch = algorithmId === 'binary-search';
    const isRecursion = algorithmId === 'recursion';

    // Show/hide array controls vs recursion controls
    if (this.elements.arrayControlsPanel) {
      this.elements.arrayControlsPanel.classList.toggle('hidden', isRecursion);
    }
    if (this.elements.recursionControlsPanel) {
      this.elements.recursionControlsPanel.classList.toggle('hidden', !isRecursion);
    }

    // Show/hide search target input
    if (this.elements.targetControlGroup) {
      this.elements.targetControlGroup.classList.toggle('hidden', !isSearching);
    }

    // Show/hide sort button / warning for binary search
    if (this.elements.sortBtn) {
      this.elements.sortBtn.classList.toggle('highlighted', isBinarySearch);
    }

    if (this.elements.sortWarning) {
      if (isBinarySearch && !isSortedAscending(this.currentArray)) {
        this.elements.sortWarning.classList.remove('hidden');
      } else {
        this.elements.sortWarning.classList.add('hidden');
      }
    }
  }

  /**
   * Update play/pause button visual state
   * @param {boolean} isPlaying 
   */
  setPlayState(isPlaying) {
    if (!this.elements.playBtn) return;
    if (isPlaying) {
      this.elements.playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
        </svg>
        <span>Pause</span>
      `;
      this.elements.playBtn.classList.add('playing');
    } else {
      this.elements.playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>Play</span>
      `;
      this.elements.playBtn.classList.remove('playing');
    }
  }
}
