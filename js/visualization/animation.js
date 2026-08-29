/**
 * Playback & Timeline Engine for Algorithm Visualizer
 * Manages recorded steps, play/pause interval, next/prev step execution,
 * timeline scrubbing, and speed configurations.
 */

export class AnimationController {
  constructor({ onStepChange, onComplete, onStateChange }) {
    this.steps = [];
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.speedMs = 600; // Default normal speed
    this.timerId = null;

    // Callbacks
    this.onStepChange = onStepChange || (() => {});
    this.onComplete = onComplete || (() => {});
    this.onStateChange = onStateChange || (() => {});
  }

  /**
   * Load new sequence of steps
   * @param {Array} steps 
   */
  loadSteps(steps = []) {
    this.pause();
    this.steps = steps;
    this.currentStepIndex = 0;
    this.notifyStep();
    this.onStateChange({ isPlaying: this.isPlaying, isFinished: this.isFinished() });
  }

  /**
   * Get current active step
   */
  getCurrentStep() {
    if (!this.steps || this.steps.length === 0) return null;
    return this.steps[this.currentStepIndex];
  }

  /**
   * Start or resume automatic playback
   */
  play() {
    if (this.steps.length === 0) return;

    if (this.currentStepIndex >= this.steps.length - 1) {
      // If already at the end, restart from beginning
      this.currentStepIndex = 0;
      this.notifyStep();
    }

    this.isPlaying = true;
    this.onStateChange({ isPlaying: true, isFinished: false });
    this.scheduleNextFrame();
  }

  /**
   * Pause automatic playback
   */
  pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.onStateChange({ isPlaying: false, isFinished: this.isFinished() });
  }

  /**
   * Toggle between Play and Pause
   */
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Advance exactly one step forward
   */
  nextStep() {
    if (this.steps.length === 0) return false;
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.notifyStep();
      const finished = this.isFinished();
      this.onStateChange({ isPlaying: this.isPlaying, isFinished: finished });
      if (finished) this.onComplete();
      return true;
    }
    return false;
  }

  /**
   * Step backward one step
   */
  prevStep() {
    if (this.steps.length === 0) return false;
    if (this.currentStepIndex > 0) {
      this.pause();
      this.currentStepIndex--;
      this.notifyStep();
      this.onStateChange({ isPlaying: false, isFinished: false });
      return true;
    }
    return false;
  }

  /**
   * Jump directly to a specific step index
   * @param {number} index 
   */
  goToStep(index) {
    if (this.steps.length === 0) return;
    const clamped = Math.max(0, Math.min(this.steps.length - 1, index));
    this.currentStepIndex = clamped;
    this.notifyStep();
    const finished = this.isFinished();
    this.onStateChange({ isPlaying: this.isPlaying, isFinished: finished });
    if (finished && this.isPlaying) {
      this.pause();
      this.onComplete();
    }
  }

  /**
   * Reset playback to initial step (Step 0)
   */
  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this.notifyStep();
    this.onStateChange({ isPlaying: false, isFinished: false });
  }

  /**
   * Set playback speed in milliseconds per step
   * @param {number} speedMs 
   */
  setSpeed(speedMs) {
    this.speedMs = Math.max(20, speedMs);
  }

  /**
   * Check if playback reached the final step
   */
  isFinished() {
    return this.steps.length > 0 && this.currentStepIndex >= this.steps.length - 1;
  }

  /**
   * Internal scheduler loop for playing frames
   */
  scheduleNextFrame() {
    if (!this.isPlaying) return;

    this.timerId = setTimeout(() => {
      if (!this.isPlaying) return;

      const hasNext = this.nextStep();
      if (hasNext && !this.isFinished()) {
        this.scheduleNextFrame();
      } else {
        this.pause();
      }
    }, this.speedMs);
  }

  notifyStep() {
    const step = this.getCurrentStep();
    if (step) {
      this.onStepChange(step, this.currentStepIndex, this.steps.length);
    }
  }
}
