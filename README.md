# 🚀 Algorithm Visualizer

> **"See algorithms. Understand algorithms."**

An interactive, responsive, portfolio-grade web application built to make Data Structures and Algorithms (DSA) intuitive through step-by-step visual animation, execution state tracking, complexity analysis, and synchronized C++ code line tracing.

---

## 🌟 Live Demo & Preview

* **Theme**: Modern Dark Mode with quick toggle to Crisp Light Mode
* **Design Philosophy**: Process-first learning — visual animations for every comparison, swap, partition, boundary shift, and recursive call frame.
* **Technology**: Vanilla HTML5, CSS3 (Custom Design System with CSS Variables & Glassmorphism), ES6+ Modular JavaScript (Zero external heavy dependencies).

---

## 🧠 Algorithms Implemented

The visualizer implements **8 essential algorithms** across three core DSA pillars:

### 1. 🔍 Searching
| Algorithm | Best Time | Average Time | Worst Time | Space | Characteristics |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Linear Search** | $O(1)$ | $O(n)$ | $O(n)$ | $O(1)$ | Sequential scan, works on unsorted & sorted data |
| **Binary Search** | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(1)$ | Divide & conquer, requires sorted array, search bounds |

### 2. 📊 Sorting
| Algorithm | Best Time | Average Time | Worst Time | Space | Characteristics |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Stable, in-place, adjacent swaps, sorted suffix |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Unstable, in-place, minimum element tracking |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Stable, adaptive, online, key shift & insert |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Stable, divide & conquer, guaranteed performance |
| **Quick Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | Unstable, in-place partitioning, pivot element tracking |

### 3. 🔄 Recursion
| Algorithm | Best Time | Average Time | Worst Time | Stack Space | Characteristics |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Recursion (Factorial & Call Stack)** | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ | LIFO Stack frames, Base case check ($n \le 1$), Unwinding |

---

## 🎯 Key Features

1. **Step-by-Step State Timeline Engine**:
   * Every algorithm acts as a pure generator producing immutable snapshot states.
   * Enables seamless **Next Step** (⏭) and **Previous Step** (⏮) navigation.
   * Full **Timeline Scrubber** allows jumping to any point in the algorithm's lifecycle.
   * Variable speed playback: **Slow** ($1200\text{ms}$), **Normal** ($600\text{ms}$), **Fast** ($200\text{ms}$), and **Turbo** ($60\text{ms}$).

2. **Rich Visual Canvas**:
   * **Vertical Bars**: Dynamically scaled based on maximum value with numeric values and index labels.
   * **Visual State Color Palette**:
     * 🟦 Indigo: Unsorted / Idle
     * 🟨 Amber: Currently comparing elements
     * 🟥 Coral: Active swap / shifting element
     * 🟪 Purple: Pivot / Minimum element / Selected key
     * 🟩 Emerald: Sorted element / Target found
     * ⬛ Dimmed Slate: Discarded search space / Eliminated partition
   * **Pointer Badges**: Dynamic floating labels ($i, j, \text{low}, \text{mid}, \text{high}, \text{min}, \text{pivot}$).

3. **Dedicated Recursion Call Stack Visualizer**:
   * Visualizes function invocations pushing activation records onto the Call Stack in real-time.
   * Highlights base case evaluation ($n \le 1$).
   * Demonstrates return unwinding in Last-In-First-Out (LIFO) order with intermediate calculations.

4. **Synchronized C++ Code Execution**:
   * Syntax-highlighted C++ code panel with an active line indicator that updates in lockstep with the visualization.

5. **Customizable Inputs & Controls**:
   * Custom array input (comma-separated with validation).
   * Random array generator with size slider ($5$ to $35$ elements).
   * Shuffle and Auto-sort actions.
   * Target value selector with "Pick from Array" shortcut.
   * Recursion depth slider ($n=1$ to $8$).

6. **Keyboard Shortcuts**:
   * `Space`: Play / Pause
   * `→` (Right Arrow): Next Step
   * `←` (Left Arrow): Previous Step
   * `R`: Reset to initial step

---

## 🏗️ Architecture & Project Structure

The project strictly decouples algorithm logic from DOM rendering for maximum maintainability:

```text
algorithm-visualizer/
│
├── index.html                  # Accessible dashboard layout & containers
├── styles.css                  # CSS design system (tokens, themes, animations, glassmorphism)
│
├── js/
│   ├── main.js                 # App orchestrator, keyboard bindings, theme manager
│   ├── algorithms/             # Pure step generator functions
│   │   ├── linearSearch.js
│   │   ├── binarySearch.js
│   │   ├── bubbleSort.js
│   │   ├── selectionSort.js
│   │   ├── insertionSort.js
│   │   ├── mergeSort.js
│   │   ├── quickSort.js
│   │   └── recursion.js
│   │
│   ├── visualization/          # Presentation and animation layer
│   │   ├── renderer.js         # DOM bar & call stack renderer, code highlighter
│   │   ├── animation.js        # Timeline playback controller
│   │   └── controls.js         # Input handlers, buttons, sliders
│   │
│   └── utils/
│       ├── helpers.js          # Array generators, shuffle, validator
│       └── algorithmInfo.js   # Complexities, descriptions, C++ code mappings
│
└── README.md
```

---

## 💻 How to Run Locally

Because the project uses standard ES6 modules, it should be served via a lightweight local HTTP server:

### Option 1: Using Node.js / `npx`
```bash
# Using serve
npx serve .

# Or using http-server
npx http-server .
```

### Option 2: Using Python 3
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 3: VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 🔮 Future Improvements

* [ ] **Graph Algorithms**: BFS, DFS, Dijkstra's Shortest Path, A* Search.
* [ ] **Tree Visualizations**: Binary Search Tree (BST) insertion, deletion, AVL rotations.
* [ ] **Pathfinding Grid**: 2D maze generator and pathfinding visualizer.
* [ ] **React / TypeScript Port**: Component library packaging.
* [ ] **Audio Feedback**: Musical pitches mapped to array bar values during sorting (Sound of Sorting).
* [ ] **AI-Powered Explanations**: Interactive AI walkthroughs of complex partitioning and edge cases.
* [ ] **Custom Algorithm Sandbox**: User-written JavaScript/C++ code parser.

---

## 📄 License
MIT License. Created with ❤️ for students and software engineers mastering Data Structures & Algorithms.
