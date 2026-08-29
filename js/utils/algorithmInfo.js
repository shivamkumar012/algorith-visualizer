/**
 * Metadata, Complexity, Characteristics, and C++ Code implementations
 * for all 8 algorithms supported in Algorithm Visualizer.
 */

export const ALGORITHM_INFO = {
  'linear-search': {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'Searching',
    badge: 'Searching',
    shortDescription: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
    howItWorks: [
      'Start at the very first element (index 0) of the array.',
      'Compare the current element with the target value.',
      'If the current element matches the target, return its index immediately (Search Successful).',
      'If it does not match, advance to the next element.',
      'Repeat until the element is found or the end of the array is reached (Target Not Found).'
    ],
    complexity: {
      timeBest: 'O(1)',
      timeAvg: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)'
    },
    characteristics: [
      { label: 'Type', value: 'Sequential Search' },
      { label: 'Data Order', value: 'Unsorted or Sorted' },
      { label: 'In-Place', value: 'Yes' },
      { label: 'Space Complexity', value: 'Auxiliary O(1)' }
    ],
    cppCode: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Element found at index i
        }
    }
    return -1; // Target not present in array
}`
  },

  'binary-search': {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    badge: 'Searching',
    shortDescription: 'Efficiently searches a sorted array by repeatedly dividing the search interval in half.',
    howItWorks: [
      'Array MUST be sorted in ascending order beforehand.',
      'Set low pointer to 0 and high pointer to n - 1.',
      'Calculate the middle index: mid = low + (high - low) / 2.',
      'If target matches arr[mid], the search is successful and terminates.',
      'If target < arr[mid], discard the right half by setting high = mid - 1.',
      'If target > arr[mid], discard the left half by setting low = mid + 1.',
      'Repeat while low <= high. If low exceeds high, target is not present.'
    ],
    complexity: {
      timeBest: 'O(1)',
      timeAvg: 'O(log n)',
      timeWorst: 'O(log n)',
      space: 'O(1)'
    },
    characteristics: [
      { label: 'Type', value: 'Divide and Conquer' },
      { label: 'Requires Sorted', value: 'Yes (Strictly Required)' },
      { label: 'In-Place', value: 'Yes' },
      { label: 'Space Complexity', value: 'Iterative O(1) / Recursive O(log n)' }
    ],
    cppCode: `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target)
            return mid; // Target found at index mid
        else if (arr[mid] < target)
            low = mid + 1;  // Search in right half
        else
            high = mid - 1; // Search in left half
    }
    return -1; // Target not found
}`
  },

  'bubble-sort': {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    badge: 'Sorting',
    shortDescription: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    howItWorks: [
      'Iterate through the array from left to right.',
      'Compare adjacent elements arr[j] and arr[j + 1].',
      'If arr[j] > arr[j + 1], swap the two elements.',
      'After each complete pass, the largest unsorted element bubbles up to its correct final position at the end.',
      'Repeat for n - 1 passes or terminate early if no swaps occurred in a full pass.'
    ],
    complexity: {
      timeBest: 'O(n) (when optimized)',
      timeAvg: 'O(n²)',
      timeWorst: 'O(n²)',
      space: 'O(1)'
    },
    characteristics: [
      { label: 'Stability', value: 'Stable' },
      { label: 'In-Place', value: 'Yes' },
      { label: 'Method', value: 'Exchanging' },
      { label: 'Adaptive', value: 'Yes (with swap flag)' }
    ],
    cppCode: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Array is already sorted
    }
}`
  },

  'selection-sort': {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Sorting',
    badge: 'Sorting',
    shortDescription: 'Divides the array into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted region and moving it to the sorted region.',
    howItWorks: [
      'Maintain two subarrays: the sorted prefix on the left and the unsorted suffix on the right.',
      'For each position i (from 0 to n - 2), assume arr[i] is the minimum (min_idx = i).',
      'Scan the remaining unsorted elements (from i + 1 to n - 1) to find the actual minimum element.',
      'Swap the found minimum element with arr[i].',
      'Expand the sorted prefix by 1 and repeat until the array is fully sorted.'
    ],
    complexity: {
      timeBest: 'O(n²)',
      timeAvg: 'O(n²)',
      timeWorst: 'O(n²)',
      space: 'O(1)'
    },
    characteristics: [
      { label: 'Stability', value: 'Unstable (default)' },
      { label: 'In-Place', value: 'Yes' },
      { label: 'Method', value: 'Selection' },
      { label: 'Swaps Made', value: 'O(n) maximum' }
    ],
    cppCode: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            std::swap(arr[i], arr[minIdx]);
        }
    }
}`
  },

  'insertion-sort': {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Sorting',
    badge: 'Sorting',
    shortDescription: 'Builds the sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position among the previously sorted elements.',
    howItWorks: [
      'Consider the first element (index 0) as already sorted.',
      'Pick the next element as the key (starting from index 1).',
      'Compare the key with elements in the sorted prefix (from right to left).',
      'Shift all elements greater than key one position to the right to make room.',
      'Insert the key into its correct vacant position.',
      'Repeat for all remaining elements until the entire array is sorted.'
    ],
    complexity: {
      timeBest: 'O(n) (nearly sorted)',
      timeAvg: 'O(n²)',
      timeWorst: 'O(n²)',
      space: 'O(1)'
    },
    characteristics: [
      { label: 'Stability', value: 'Stable' },
      { label: 'In-Place', value: 'Yes' },
      { label: 'Method', value: 'Insertion' },
      { label: 'Online/Adaptive', value: 'Yes' }
    ],
    cppCode: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; // Shift right
            j = j - 1;
        }
        arr[j + 1] = key; // Insert key
    }
}`
  },

  'merge-sort': {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Sorting',
    badge: 'Sorting',
    shortDescription: 'A classic Divide and Conquer algorithm that recursively divides the array into halves, sorts each half, and merges the sorted halves together.',
    howItWorks: [
      'Divide: Find the midpoint mid = (left + right) / 2 and recursively divide array into two halves.',
      'Base Case: A single element subarray (left == right) is already sorted.',
      'Conquer: Recursively sort the left subarray and the right subarray.',
      'Combine (Merge): Compare elements from both halves sequentially and place them in sorted order into an auxiliary array.',
      'Copy the merged elements back into the original array.'
    ],
    complexity: {
      timeBest: 'O(n log n)',
      timeAvg: 'O(n log n)',
      timeWorst: 'O(n log n)',
      space: 'O(n)'
    },
    characteristics: [
      { label: 'Stability', value: 'Stable' },
      { label: 'In-Place', value: 'No (Auxiliary O(n))' },
      { label: 'Paradigm', value: 'Divide and Conquer' },
      { label: 'Guaranteed', value: 'Strict O(n log n)' }
    ],
    cppCode: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
  },

  'quick-sort': {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Sorting',
    badge: 'Sorting',
    shortDescription: 'Selects a "pivot" element and partitions the array such that smaller elements move left and greater elements move right, then sorts partitions recursively.',
    howItWorks: [
      'Choose a pivot element (commonly the rightmost element arr[high]).',
      'Partitioning: Rearrange elements so that all elements smaller than pivot come before it, and all greater elements come after it.',
      'Maintain an index i tracking the boundary of smaller elements.',
      'Iterate j from low to high - 1: If arr[j] <= pivot, increment i and swap arr[i] with arr[j].',
      'Finally, swap arr[i + 1] with arr[high] to place pivot in its exact sorted position.',
      'Recursively apply Quick Sort to the left and right subarrays.'
    ],
    complexity: {
      timeBest: 'O(n log n)',
      timeAvg: 'O(n log n)',
      timeWorst: 'O(n²)',
      space: 'O(log n)'
    },
    characteristics: [
      { label: 'Stability', value: 'Unstable' },
      { label: 'In-Place', value: 'Yes' },
      { label: 'Paradigm', value: 'Divide and Conquer' },
      { label: 'Space Complexity', value: 'O(log n) Call Stack' }
    ],
    cppCode: `int partition(int arr[], int low, int high) {
    int pivot = arr[high]; // Choose last element as pivot
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1; // Pivot index
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);  // Left partition
        quickSort(arr, pi + 1, high); // Right partition
    }
}`
  },

  'recursion': {
    id: 'recursion',
    name: 'Recursion (Factorial & Call Stack)',
    category: 'Recursion',
    badge: 'Recursion',
    shortDescription: 'Demonstrates how a function solves a problem by calling itself with smaller sub-problems until reaching a base case, followed by call stack unwinding.',
    howItWorks: [
      'Function Call (Push): factorial(n) is invoked and a new stack frame is pushed onto the Call Stack.',
      'Sub-problem: To compute factorial(n), it pauses and calls factorial(n - 1).',
      'Stack Growth: Stack frames accumulate: factorial(5) → factorial(4) → factorial(3) → factorial(2) → factorial(1).',
      'Base Case Reached: When n <= 1, factorial(1) directly returns 1 without further recursion.',
      'Unwinding (Pop): The call stack unwinds in Last-In-First-Out (LIFO) order, multiplying the returned value: 2*1=2 → 3*2=6 → 4*6=24 → 5*24=120.',
      'Final Return: The initial caller receives the final evaluated result.'
    ],
    complexity: {
      timeBest: 'O(n)',
      timeAvg: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(n) Stack Space'
    },
    characteristics: [
      { label: 'Paradigm', value: 'Recursion (LIFO Stack)' },
      { label: 'Base Case', value: 'n <= 1 (Returns 1)' },
      { label: 'Recursive Step', value: 'n * factorial(n - 1)' },
      { label: 'Call Stack Depth', value: 'O(n) Frames' }
    ],
    cppCode: `int factorial(int n) {
    // Base Case: when n is 0 or 1, return 1
    if (n <= 1) {
        return 1;
    }
    // Recursive Step: n * factorial(n - 1)
    int subResult = factorial(n - 1);
    int result = n * subResult;
    return result;
}`
  }
};
