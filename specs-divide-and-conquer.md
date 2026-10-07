# Algorithm Playground — Divide and Conquer

## Functional and Technical Specification

**Proposed releases:** 0.11–0.15  
**Status:** Implementation specification  
**Primary audience:** Codex and future maintainers

---

## 1. Implementation directive

Implement **Divide and Conquer** as a new family of learning laboratories within the existing Algorithm Playground. Preserve the current static-web architecture, central algorithm registry, instrumented execution engine, reusable traces, pseudocode rendering, Teacher Mode, Presentation Mode, accessibility support, EMI/CLIL language support, and the separation between algorithms and learning activities.

Students must never enter arbitrary executable code or replace an algorithm implementation. Algorithms are predefined and instrumented. Students may manipulate valid inputs, predict recursive actions, construct instances, expand recurrence trees, select mathematical steps, compare variants, and explain conclusions.

The principal learning cycle for this family is:

> **PREDICT → DIVIDE → TRACE → COMBINE → CONJECTURE → ANALYZE → EXPLAIN**

At meaningful moments, execution must pause and ask the student to predict the next semantic event from the current recursive state. Questions must assess understanding of subproblems, return values, combination logic, recursion trees, and asymptotic analysis—not memorization of the next pseudocode line.

Reuse the shared **Decision Checkpoint Engine** introduced for the Greedy Algorithms iteration. Extend it only where recursion-specific response types or state projections are required. Do not build a second checkpoint system.

Do not rewrite working modules merely to conform to this specification. If an existing Merge Sort, recurrence, or closest-pair prototype is present, preserve its correct behavior and refactor only the shared functionality needed for integration. Keep the application deployable and usable after every release.

---

## 2. Scope

Add a new family to the home page:

```text
DIVIDE & CONQUER
 ├ Divide & Conquer Anatomy
 ├ Merge Sort Lab
 ├ Inversion Counting Lab
 ├ Closest Pair Explorer
 ├ Recursion Tree Lab
 └ Master Theorem Lab
```

The family covers:

1. the divide–conquer–combine structure;
2. recursive calls, base cases, return values, and call stacks;
3. Merge Sort and linear-time merge;
4. inversion counting with `SortAndCount` and `MergeAndCount`;
5. closest pair of points in one and two dimensions;
6. the closest-pair strip and bounded-neighbor comparison;
7. recurrence trees;
8. substitution and induction as guided proof methods;
9. the Master Theorem and its three principal cases;
10. conditions and limitations of the Master Theorem;
11. the effect of implementation choices on the recurrence and complexity.

The initial implementation must not add unrelated divide-and-conquer algorithms merely to expand the catalog.

---

## 3. Learning objectives

After completing the activities, a student should be able to:

1. identify the divide, conquer, combine, and base-case components of an algorithm;
2. interpret a recursion tree and a runtime call stack;
3. predict the next recursive call, return, or combination event;
4. execute the merge operation using two indices;
5. derive the recurrence for Merge Sort;
6. explain why Merge Sort runs in \(\Theta(n\log n)\);
7. classify inversions as left, right, or crossing inversions;
8. explain why selecting an element from the right list can count several inversions at once;
9. compare brute-force and divide-and-conquer inversion counting;
10. execute the divide-and-conquer closest-pair algorithm;
11. construct and inspect the central strip;
12. explain why only a constant number of following points must be inspected in the strip;
13. distinguish sorting once from sorting inside every recursive call;
14. construct the first levels of a recurrence tree;
15. calculate the number, size, and work of subproblems at level \(i\);
16. connect tree-level work to the Master Theorem;
17. select and apply the appropriate Master Theorem case;
18. recognize recurrences for which the Master Theorem does not apply directly;
19. formulate a complexity conjecture and verify it by substitution or induction;
20. distinguish experimental evidence, a recurrence derivation, and a mathematical proof.

---

## 4. Architectural principles

### 4.1 Algorithms, visualizers, and activities remain separate

An algorithm definition provides:

- metadata;
- pseudocode;
- supported inputs;
- deterministic execution logic;
- semantic trace events;
- immutable state snapshots;
- operation counters;
- correctness and complexity metadata.

A visualizer renders trace state. It must not implement the algorithm.

An activity definition provides:

- a learning objective;
- an algorithm or mathematical model;
- a curated or constrained-generated instance;
- stage sequence;
- checkpoint policy;
- prompts, hints, and explanations;
- completion conditions.

### 4.2 Recursive trace, not animation script

Recursive algorithms must generate a semantic trace representing:

- call creation;
- input segment or region;
- base-case detection;
- subdivision;
- child call activation;
- child return;
- returned value;
- combination;
- final return.

The trace must be usable by both the call-tree view and the call-stack view.

### 4.3 Mathematical models are first-class activities

Recursion trees and Master Theorem exercises are not implemented as animations of pseudocode. They use structured recurrence objects that can produce symbolic and numeric level data.

### 4.4 Predefined algorithms only

Students may edit arrays, rankings, points, recurrence parameters, and permitted strategy options. They may not submit arbitrary JavaScript or pseudocode for execution.

### 4.5 Evidence is not proof

Experimental modules must include:

> **Experiments can suggest a pattern, but an asymptotic conclusion requires analysis of the recurrence or algorithm.**

Spanish support:

> Los experimentos pueden sugerir un patrón, pero una conclusión asintótica requiere analizar la recurrencia o el algoritmo.

---

## 5. Suggested project structure

Adapt this structure to the existing project rather than duplicating working components.

```text
algorithm-playground/
├── divide-and-conquer.html
├── merge-sort.html
├── inversion-counting.html
├── closest-pair.html
├── recursion-trees.html
├── master-theorem.html
├── css/
│   ├── recursion-visualizer.css
│   └── geometry-visualizer.css
├── js/
│   ├── core/
│   │   ├── recursive-trace.js
│   │   ├── recursion-tree.js
│   │   ├── call-stack-view.js
│   │   ├── recurrence-model.js
│   │   └── symbolic-display.js
│   ├── algorithms/
│   │   ├── merge-sort.js
│   │   ├── inversion-count.js
│   │   └── closest-pair.js
│   ├── modules/
│   │   ├── divide-conquer-anatomy.js
│   │   ├── merge-sort-lab.js
│   │   ├── inversion-counting-lab.js
│   │   ├── closest-pair-explorer.js
│   │   ├── recursion-tree-lab.js
│   │   └── master-theorem-lab.js
│   └── data/
│       ├── divide-conquer-activities.js
│       ├── array-instances.js
│       ├── point-instances.js
│       └── recurrence-instances.js
└── tests/
    └── divide-conquer-tests.html
```

---

## 6. Recursive Trace Engine

### 6.1 Purpose

Extend the existing trace model so that one execution can drive:

- pseudocode highlighting;
- array or geometry visualization;
- recursion tree;
- runtime call stack;
- variables and return values;
- Decision Checkpoints;
- operation counters.

### 6.2 Call-frame model

```javascript
{
    frameId: "merge-sort-1-L",
    parentFrameId: "merge-sort-1",
    algorithm: "merge-sort",
    depth: 1,
    status: "active", // pending | active | waiting | returned

    input: {
        values: [8, 3, 6, 2],
        range: [0, 4]
    },

    localVariables: {
        mid: 2
    },

    childFrameIds: [],
    returnValue: null
}
```

### 6.3 Required recursive event types

```text
callCreated
callActivated
baseCaseChecked
baseCaseReached
problemDivided
childCallStarted
childCallReturned
combineStarted
combineStep
combineCompleted
callReturned
```

Algorithm-specific events extend these types rather than replacing them.

### 6.4 Example event

```javascript
{
    step: 18,
    type: "childCallReturned",
    frameId: "merge-sort-root",
    childFrameId: "merge-sort-root-left",
    line: 5,

    variables: {
        leftResult: [2, 3, 6, 8]
    },

    structures: {
        callStack: ["merge-sort-root"],
        activeFrames: ["merge-sort-root"],
        completedFrames: ["merge-sort-root-left"]
    },

    visualization: {
        activeRange: [0, 8],
        completedRange: [0, 4]
    },

    nextEligibleCheckpoint: "predict-next-child"
}
```

### 6.5 Snapshot requirements

Every trace step must store immutable snapshots of all state needed to restore it. Do not share mutable arrays, point objects, stack objects, or tree-node references between steps.

The Previous Step control must restore:

- active frame;
- call stack;
- recursion-tree statuses;
- array or point state;
- indices and variables;
- partial return values;
- counters;
- checkpoint state.

### 6.6 Execution order

The default trace should reflect the pseudocode's sequential execution order, normally left recursive call followed by right recursive call. If an activity abstracts away execution order and treats calls as conceptually parallel, label that view explicitly.

---

## 7. Recursion Tree and Call Stack components

### 7.1 Recursion Tree

Each node must display, as appropriate:

- frame identifier;
- subproblem size;
- input segment or spatial region;
- local nonrecursive work;
- status;
- return value.

Required visual states:

```text
PENDING
ACTIVE
WAITING FOR CHILD
COMBINING
RETURNED
```

Do not rely on color alone.

### 7.2 Runtime Call Stack

Show stack frames vertically with the active frame at the top. Each frame should display only pedagogically relevant values.

The stack and tree must remain synchronized:

- a new call adds a stack frame and activates a tree node;
- a return removes a stack frame and marks its node returned;
- the parent becomes active again;
- combination occurs in the parent frame.

### 7.3 Tree abstraction levels

Support:

- concrete values for small inputs;
- sizes only for large inputs;
- symbolic labels such as \(n/2^i\);
- collapsed subtrees for presentation.

### 7.4 Required checkpoints

Ask students to predict:

- whether the next event is a divide, call, return, or combine;
- the next two subproblem sizes;
- the active stack frame after a return;
- whether a parent can combine yet;
- the return value of a completed base case.

---

## 8. Divide & Conquer Anatomy Lab

### 8.1 Purpose

Introduce the paradigm before focusing on a particular algorithm.

### 8.2 Structure identification

Present curated algorithm descriptions or pseudocode fragments. Ask the student to label:

```text
DIVIDE
CONQUER
COMBINE
BASE CASE
```

Examples may include Merge Sort, binary search, summing an array recursively, and brute-force pair comparison.

### 8.3 Is it Divide and Conquer?

For each curated strategy, ask:

```text
YES
PARTIALLY
NO
```

Then require identification of missing or present components. Do not require every valid divide-and-conquer algorithm to create exactly two equal subproblems.

### 8.4 Build the first levels

Given a problem of size \(n\) or a numeric size such as 16, the student selects:

- number of children;
- size of each child;
- stopping size;
- combination work.

After two or three manually completed levels, ask the student to predict the general pattern.

### 8.5 Required conclusion

The activity must emphasize that dividing the input does not by itself guarantee improved complexity. The number and size of subproblems and the cost of division/combination determine the recurrence.

---

## 9. Merge Sort Lab

### 9.1 Algorithm

Use a predefined Merge Sort that:

1. returns immediately for a list of size at most one;
2. divides the list into two halves;
3. sorts the left half recursively;
4. sorts the right half recursively;
5. merges the two sorted results in linear time.

Use a consistent policy for odd sizes and document it in the pseudocode and tests.

### 9.2 Required synchronized views

- full array and active subarray;
- recursion tree;
- call stack;
- left and right merge inputs;
- output buffer;
- indices `i`, `j`, and output position;
- pseudocode;
- operation counters.

### 9.3 Merge visualizer

For two sorted lists `A` and `B`, display:

```text
A = [3, 7, 10, 18]
         ↑ i

B = [2, 11, 20, 23]
     ↑ j

C = [2, 3, 7]
```

Required states:

```text
UNREAD
CURRENT
COMPARED
COPIED
EXHAUSTED
```

### 9.4 Required Decision Checkpoints

#### Predict the division

Ask which two subarrays are created.

#### Predict the next recursive event

Ask whether the next event is another division, a base-case return, a right-child call, or a merge.

#### Predict the next merged element

Ask which of `A[i]` and `B[j]` is appended and which index advances.

#### Handle an exhausted list

Ask what happens when one merge input has no elements remaining.

#### Predict parent readiness

Ask whether a parent may combine when only one child has returned.

### 9.5 Operation counters

At minimum count:

- comparisons between elements;
- copies to the output buffer;
- recursive calls;
- merge operations;
- maximum recursion depth.

Display operation counts, not measured runtime, as the principal theoretical evidence.

### 9.6 Complexity activity

After execution, connect the trace to:

\[
T(n)=2T(n/2)+\Theta(n).
\]

The student must identify:

- `2`: two recursive subproblems;
- `n/2`: size of each subproblem;
- `Theta(n)`: total divide and merge work per call.

Then send the recurrence to the Recursion Tree Lab without duplicating recurrence logic.

### 9.7 Comparison activity

Compare Merge Sort with a predefined quadratic sort on the same inputs. Show counts for increasing `n` and invite a growth-class conjecture. Do not present timing measurements as proof.

---

## 10. Inversion Counting Lab

### 10.1 Definitions

For positions \(i<j\), the pair is an inversion when:

\[
a_i>a_j.
\]

The algorithm returns both:

- the number of inversions;
- the sorted list.

### 10.2 Ranking Builder

Allow students to reorder a small predefined set using mouse or keyboard controls.

Challenges:

```text
Construct a ranking with exactly 5 inversions.
Construct a ranking with no inversions.
Construct the maximum number of inversions for n = 6.
Change one adjacent pair and predict the new count.
```

Do not reveal all inversion pairs before the student submits a prediction.

### 10.3 Inversion classification

After dividing into `A` and `B`, ask the student to classify displayed inversion pairs as:

```text
INSIDE A
INSIDE B
CROSSING A–B
NOT AN INVERSION
```

Connect this classification to:

\[
r=r_A+r_B+r_{AB}.
\]

### 10.4 MergeAndCount visualizer

Reuse the Merge Sort merge visualizer. Add:

- crossing-inversion counter;
- number of elements remaining in `A`;
- highlighted inversion pairs;
- accumulated total.

When `A[i] > B[j]`, ask:

> How many new crossing inversions are counted?

The correct answer is the number of unread elements remaining in `A`, assuming both lists are sorted.

### 10.5 Required checkpoints

- predict the next merged element;
- predict whether the counter changes;
- enter the size of the counter increment;
- select all newly counted pairs for small inputs;
- predict the combined result `rA + rB + rAB`;
- identify why the sorted list must also be returned.

### 10.6 Brute force comparison

Run a predefined \(\Theta(n^2)\) pair-checking algorithm and `SortAndCount` on the same input. Show:

- identical final counts;
- pair checks or comparisons;
- recursion-tree work;
- growth over several values of `n`.

### 10.7 Correctness reflection

Conclude with:

> Why does choosing `B[j]` count an inversion with every unread element in `A`?

The explanation must reference sorted order.

---

## 11. Closest Pair Explorer

### 11.1 Supported algorithms

Provide predefined implementations of:

1. brute-force closest pair in 2D;
2. closest pair in 1D after sorting;
3. divide-and-conquer closest pair in 2D;
4. a deliberately less efficient variant that sorts inside every recursive call, for comparison only.

### 11.2 Point editor

Allow students to:

- add a point;
- move a point;
- delete a point;
- generate a constrained random instance;
- load curated presets;
- reset the instance.

Provide keyboard alternatives for every point-editing action. Set reasonable maximum sizes for step-by-step visualization.

### 11.3 Required visual layers

- all points;
- active recursive region;
- vertical division line;
- left and right regions;
- best left pair and distance \(\delta_l\);
- best right pair and distance \(\delta_r\);
- current \(\delta=\min(\delta_l,\delta_r)\);
- central strip;
- strip points ordered by `y`;
- current candidate pair;
- best pair for the active region;
- resolved regions.

Inactive geometry should remain visible but subdued.

### 11.4 Base case

For at most three points, compare all pairs directly. Ask the student to predict the base-case closest pair before revealing the distances.

### 11.5 Required checkpoints

#### Predict the division

Ask which points belong to each recursive half. Handle median and equal-`x` cases using the algorithm's documented stable partition policy.

#### Predict partial delta

Given \(\delta_l\) and \(\delta_r\), ask for \(\delta\).

#### Construct the strip

Ask the student to select all points satisfying the algorithm's strip condition relative to the dividing coordinate.

#### Predict the next strip comparison

Show the `y`-ordered strip and ask which pair is compared next.

#### Predict an update

Ask whether the candidate distance replaces the current \(\delta\) and best pair.

#### Identify the source of the answer

At return time, ask whether the winning pair came from the left half, right half, or crossed the division.

### 11.6 Seven-Neighbor Challenge

Provide a geometric activity explaining why each strip point needs to be compared with only a constant number of following points in `y` order.

The activity should:

- display a strip of width related to \(\delta\);
- divide a local region into cells of appropriate dimensions;
- let the student place or inspect points subject to the invariant that no pair already within one half is closer than \(\delta\);
- demonstrate the packing bound visually;
- connect the geometric bound to linear strip processing.

The interface may use “compare with at most the next 7 points,” consistent with the course material. Treat this as an upper bound, not as a requirement to compare exactly seven points near the end of the list.

### 11.7 Curated instance challenges

Include instances where the closest pair:

- lies entirely in the left half;
- lies entirely in the right half;
- crosses the division;
- is found only after several strip comparisons;
- occurs in a dense-looking but valid strip;
- has tied minimum distance with another pair.

Support multiple correct closest pairs when distances tie.

---

## 12. Sorting Once versus Sorting Recursively

### 12.1 Purpose

Demonstrate that implementation decisions change the recurrence and asymptotic cost.

### 12.2 Compared variants

#### Variant A: sort inside every call

\[
T(n)=2T(n/2)+\Theta(n\log n).
\]

#### Variant B: presort once and maintain order

Presorting cost:

\[
\Theta(n\log n).
\]

Recursive phase:

\[
T(n)=2T(n/2)+\Theta(n).
\]

Overall:

\[
\Theta(n\log n).
\]

### 12.3 Visualization

Show two recurrence trees side by side. For each level display:

- number of calls;
- total elements processed;
- sorting work;
- filtering/partitioning work;
- cumulative work.

### 12.4 Required questions

- How many times is a point included in a sorting operation?
- What is the nonrecursive work per level?
- Which recurrence corresponds to each implementation?
- Why does “using divide and conquer” not automatically imply \(\Theta(n\log n)\)?

---

## 13. Recurrence Model

### 13.1 Standard model

Represent standard recurrences with:

```javascript
{
    id: "merge-sort-recurrence",
    kind: "uniform",
    a: 2,
    b: 2,
    combineWork: {
        coefficient: 1,
        exponent: 1,
        logExponent: 0,
        display: "n"
    },
    baseSize: 1,
    baseCost: 1
}
```

This represents:

\[
T(n)=aT(n/b)+f(n).
\]

### 13.2 Nonuniform recurrences

Support a structured representation for detection and visualization even when the Master Theorem does not apply:

```javascript
{
    kind: "nonuniform",
    subproblems: [
        {scale: 0.2, multiplicity: 1},
        {scale: 0.7, multiplicity: 1}
    ],
    combineWork: {display: "(11/5)n"}
}
```

Do not attempt a general symbolic solver for arbitrary recurrences.

### 13.3 Symbolic scope

The initial recurrence engine must support:

- constant `a >= 1`;
- constant `b > 1`;
- \(f(n)=\Theta(n^c)\);
- optional \((\log n)^k\) display for limitation activities;
- numeric evaluation on powers of `b`;
- symbolic per-level expressions;
- curated nonuniform or invalid examples.

The engine is not a general-purpose computer algebra system.

---

## 14. Recursion Tree Lab

### 14.1 Builder controls

Allow selection of:

```text
a = number of subproblems
b = size reduction factor
c = exponent in local work n^c
n = initial problem size
base size
```

Use instructor-defined bounds to keep the tree renderable.

### 14.2 Per-level table

Display:

| Level | Nodes | Size per node | Work per node | Total level work |
|---:|---:|---:|---:|---:|
| \(0\) | \(1\) | \(n\) | \(n^c\) | \(n^c\) |
| \(1\) | \(a\) | \(n/b\) | \((n/b)^c\) | \(a(n/b)^c\) |
| \(i\) | \(a^i\) | \(n/b^i\) | \((n/b^i)^c\) | \(a^i(n/b^i)^c\) |

Numeric and symbolic views must remain synchronized.

### 14.3 Required checkpoints

- predict the number of nodes in the next level;
- predict subproblem size;
- predict work per node;
- predict total level work;
- predict tree depth;
- predict number of leaves;
- identify whether level work increases, remains constant, or decreases.

### 14.4 Progressive expansion

Do not render a huge tree by default. Allow:

- expand one node;
- expand one level;
- collapse a subtree;
- switch to aggregate level bars;
- switch to symbolic view.

### 14.5 Identities to derive

Guide students toward:

\[
\text{depth}=\log_b n,
\]

\[
\text{nodes at level }i=a^i,
\]

\[
\text{leaves}=a^{\log_b n}=n^{\log_b a}.
\]

Do not reveal all identities before the student predicts the first levels.

---

## 15. Master Theorem Lab

### 15.1 Core theorem scope

For the initial guided activities use:

\[
T(n)=aT(n/b)+\Theta(n^c).
\]

Compare \(c\) with \(\log_b a\).

### 15.2 Balance-of-work visualization

Define:

\[
r=\frac{a}{b^c}.
\]

Render total work per level as aligned bars.

- if `r < 1`, bars decrease and root-side work dominates;
- if `r = 1`, level work remains equal and all levels contribute;
- if `r > 1`, bars increase and leaf-side work dominates.

Link the visual pattern to:

\[
\Theta(n^c),\quad
\Theta(n^c\log n),\quad
\Theta(n^{\log_b a}).
\]

### 15.3 Guided analysis sequence

For each recurrence require the student to complete, in order:

1. identify `a`;
2. identify `b`;
3. identify `f(n)` and `c`;
4. compute or compare \(\log_b a\);
5. predict the per-level work pattern;
6. select the Master Theorem case;
7. select the final asymptotic relation.

Do not enable the final answer first.

### 15.4 Master Theorem Challenge

Provide curated cases with:

- integer and noninteger \(\log_b a\);
- irrelevant constant coefficients in \(f(n)\);
- repeated recursive terms that must be combined into `a`;
- all three theorem cases;
- boundary cases requiring careful equality.

### 15.5 Recurrence Race

Ask students to order several recurrences by asymptotic growth. After submission, show their level-work bars and theorem classifications.

### 15.6 General-form extension

An advanced collapsible section may present:

\[
T(n)=aT(n/b)+f(n)
\]

and the polynomial-gap and regularity conditions. It must clearly distinguish this version from the simpler \(n^c\) version.

---

## 16. Master Theorem Applicability Detective

### 16.1 Purpose

Teach students to check theorem conditions before applying a memorized formula.

### 16.2 Response categories

```text
APPLIES DIRECTLY
MAY APPLY USING THE GENERAL VERSION
DOES NOT APPLY DIRECTLY
NOT ENOUGH INFORMATION
```

### 16.3 Reasons

Ask the student to select one or more reasons:

- the number of subproblems is not constant;
- the coefficient would be below one;
- subproblems have different sizes;
- the recurrence is not of the required form;
- the simple polynomial version does not cover `f(n)`;
- the regularity condition must be checked;
- it is a valid direct application.

### 16.4 Required recurrence families

Include curated examples such as:

\[
T(n)=nT(n/2)+n^2,
\]

\[
T(n)=\frac12T(n/2)+n^2,
\]

\[
T(n)=2T(n/2)+n\log n,
\]

and recurrences with unequal subproblem sizes.

For examples where the simple \(n^c\) version fails but the general Master Theorem may apply, explain the distinction precisely.

Do not implement a solver for recurrences outside the theorem's supported scope.

---

## 17. Substitution and Induction Builder

### 17.1 Purpose

Allow students to assemble a proof or verification rather than merely viewing a completed derivation.

### 17.2 Supported interactions

- order proof steps;
- choose a base case;
- choose an inductive hypothesis;
- identify where the hypothesis may be substituted;
- select an algebraic or logarithmic identity;
- fill a missing exponent or coefficient;
- identify the conclusion.

### 17.3 Initial proof activity

For powers of two and:

\[
T(n)=2T(n/2)+n,
\]

guide the student through verifying:

\[
T(n)=n\log_2 n
\]

under the activity's specified exact base conditions.

Separate exact equality exercises from asymptotic upper-bound proofs. Do not silently switch between `=`, `<=`, `O`, and `Theta`.

### 17.4 Numeric-to-symbolic bridge

Allow expansion of a concrete example such as `T(32)` before asking for the symbolic pattern. Highlight repeated terms and map them to tree levels.

---

## 18. Algorithm Designer Challenge

### 18.1 Purpose

Let students assemble a strategy from predefined components without entering code.

### 18.2 Selectable components

- division strategy;
- number and sizes of subproblems;
- base case;
- information returned by each child;
- combination operation;
- maintained ordering or auxiliary structure;
- resulting recurrence.

### 18.3 Initial problems

Use curated component sets for:

- sorting a list;
- counting inversions;
- closest pair;
- finding minimum and maximum;
- summing an array.

### 18.4 Validation

The activity should determine only properties encoded by the curated component combinations. It must not claim to verify arbitrary algorithm correctness.

Feedback may state:

- required information is missing;
- the combination step cannot reconstruct the answer;
- the strategy is correct but inefficient;
- the recurrence differs from the target;
- the selected components form the intended algorithm.

---

## 19. Diagnostic activities

### 19.1 Diagnose the Algorithm

Present a trace containing one predefined conceptual error. Ask the student to locate and explain it.

Include cases where:

- Merge Sort merges inputs that are not yet sorted;
- only one inversion is added when several remain in the left list;
- closest pair ignores the central strip;
- points are sorted inside every recursive call;
- `a`, `b`, or `f(n)` is derived incorrectly;
- the Master Theorem is applied to unequal subproblem sizes.

### 19.2 Predict the Consequence

Modify one design choice and ask how the recurrence or complexity changes:

- divide into three equal subproblems;
- change the base-case threshold;
- use a quadratic combination step;
- sort inside each recursive call;
- create one rather than two subproblems;
- double the number of recursive subproblems.

### 19.3 Explain the speedup

Require a short student explanation completing:

> The divide-and-conquer algorithm avoids ______ because ______.

Do not grade the free text automatically with AI.

---

## 20. Decision Checkpoint extensions

Reuse existing response types and add only if absent:

```text
select-array-segment
select-tree-node
select-point-set
select-point-pair
symbolic-choice
proof-step-order
```

### 20.1 Recursion-specific checkpoint model

```javascript
{
    id: "merge-parent-ready-07",
    type: "predict-recursive-event",
    responseType: "single-choice",

    prompt: {
        es: "¿Puede esta llamada combinar sus resultados ahora?",
        en: "Can this call combine its results now?"
    },

    stateProjection: {
        frameId: "merge-root-left",
        show: ["callStack", "childStatuses", "returnValues"]
    },

    options: ["combine", "call-right", "return", "divide"],
    validAnswers: ["call-right"],
    explanation: {}
}
```

### 20.2 Ties and multiple valid answers

Support multiple correct answers for:

- equal values during merge when either stable-policy-compatible answer is permitted;
- several closest pairs at the same minimum distance;
- recurrence methods where more than one analysis approach is valid.

When the implementation uses a deterministic tie policy, distinguish “the implementation's next event” from “any mathematically valid result.”

### 20.3 Incorrect experimental branch

In Demonstration Mode, allow the instructor to preview the consequence of a proposed incorrect decision. The branch must be isolated and must not mutate the canonical trace.

---

## 21. Reusable activity model

```javascript
{
    id: "merge-predict-combine",
    family: "divide-and-conquer",
    algorithm: "merge-sort",

    stages: [
        "predict",
        "divide",
        "trace",
        "checkpoint",
        "combine",
        "analyze",
        "explain"
    ],

    instance: "merge-array-04",

    views: [
        "array",
        "recursion-tree",
        "call-stack",
        "pseudocode"
    ],

    checkpointPolicy: {
        mode: "selected",
        eventTypes: ["problemDivided", "combineStep", "callReturned"],
        frequency: 2,
        maximum: 8
    },

    questions: [],
    conclusion: {}
}
```

The same Merge Sort implementation must support activities such as:

```text
Predict the next recursive event
Predict the next merge output
Trace the call stack
Derive the recurrence
Compare operation counts
Connect the trace to a recursion tree
```

---

## 22. Instance design

### 22.1 General requirements

Provide curated presets and constrained random generation. Curated instances are the default for guided activities because they guarantee meaningful checkpoints.

Each instance should include metadata:

```javascript
{
    id: "closest-cross-strip-03",
    concepts: ["strip", "crossing-pair", "delta-update"],
    difficulty: "intermediate",
    expectedCheckpoints: 6,
    allowsMultipleSolutions: false
}
```

### 22.2 Array instances

Include:

- even and odd sizes;
- already sorted and reverse-sorted lists;
- duplicate values under a documented inversion convention;
- lists with zero, few, and many inversions;
- small examples suitable for complete pair display.

Define whether equal elements count as inversions. Use the standard strict definition `A[i] > A[j]`, so equal values are not inversions.

### 22.3 Point instances

Include:

- left, right, and cross-strip winners;
- tied closest pairs;
- equal `x` coordinates;
- equal `y` coordinates;
- points near the strip boundary;
- cases that exercise the base threshold;
- layouts suitable for the seven-neighbor explanation.

Define deterministic stable partitioning for equal `x` coordinates.

### 22.4 Recurrence instances

Include:

- all three simple Master Theorem cases;
- noninteger \(\log_b a\);
- exact equality at the boundary;
- irrelevant coefficients;
- repeated recursive terms;
- unsupported nonconstant `a`;
- coefficient below one;
- unequal subproblem sizes;
- `n log n` combination work;
- insufficient-information prompts.

---

## 23. Operation and analysis views

### 23.1 Standard counters

Reuse standard counters where meaningful and add:

```text
recursiveCalls
baseCases
combineOperations
maximumDepth
pairComparisons
crossInversionsAdded
sortOperations
```

### 23.2 Operation count versus runtime

Use “operation count” for theoretical comparisons. If measured runtime is ever added, label it explicitly and keep it separate.

### 23.3 Export to Growth Explorer

Allow experiment results to use the existing common format:

```javascript
[
    {n: 8, operations: 24},
    {n: 16, operations: 64},
    {n: 32, operations: 160}
]
```

Students may compare observations with:

\[
n,\quad n\log n,\quad n^2,\quad n\log^2 n.
\]

Avoid duplicating chart logic already available elsewhere in the Playground.

---

## 24. Teacher and Presentation Modes

Extend `?teacher=1` with:

- select curated instance;
- set or display random seed;
- pause at every recursive event;
- insert a manual checkpoint;
- expand or collapse recursion-tree levels;
- switch between concrete and symbolic views;
- reveal recurrence terms separately;
- simulate a proposed incorrect choice;
- show all operation counters;
- reveal proof steps;
- reset to the previous checkpoint.

Presentation Mode must enlarge:

- active array segment or geometric region;
- recursion tree;
- call stack;
- merge indices;
- point-pair and strip highlights;
- recurrence expressions;
- checkpoint prompt and choices.

The instructor must be able to control step, pause, reveal, and reset through the keyboard.

---

## 25. EMI/CLIL language support

Keep principal interaction labels in English:

```text
PREDICT
DIVIDE
CONQUER
COMBINE
CALL
RETURN
EXPAND
COLLAPSE
CONJECTURE
ANALYZE
EXPLAIN
```

Provide contextual Spanish support and a Language Toolbox containing:

```text
The problem is divided into ___ subproblems.
Each subproblem has size ___.
The base case occurs when ___.
The recursive call returns ___.
The combine step takes ___ time.
At level i, there are ___ nodes.
The total work at this level is ___.
The recurrence is ___.
The root / all levels / leaves dominate the total work.
The Master Theorem applies because ___.
The Master Theorem does not apply directly because ___.
```

Language support must not obstruct visual state.

---

## 26. Accessibility

Meet existing accessibility requirements and add:

- every array segment, tree node, point, and pair must have a keyboard selection alternative;
- recursion-tree nodes must expose parent/child relationships to assistive technology;
- call-stack changes should be announced through an ARIA live region;
- active state must not rely on color alone;
- animations must be pausable and reducible;
- point coordinates and distances must be available as text;
- graphically displayed recurrence-level data must also appear in a table;
- zooming the recursion tree must not be required to answer a question;
- drag-and-drop interactions must have button or keyboard alternatives.

---

## 27. Persistence and privacy

Do not store academic grades or personal information.

`localStorage` may store only preferences such as:

```text
language
presentationMode
lastDivideConquerModule
animationSpeed
checkpointMode
selectedDifficulty
recursionView
```

Predictions, attempts, constructed arrays, and point sets remain in current page/session state unless a future specification explicitly adds export.

---

## 28. Testing

Add automated or browser-based tests for algorithm correctness, trace consistency, checkpoint validation, and mathematical models.

### 28.1 Recursive Trace Engine

- every created frame has exactly one parent except the root;
- every activated frame eventually returns for finite valid inputs;
- stack push/pop order matches call/return order;
- a parent combines only after required children return;
- snapshots are immutable;
- backward navigation restores all views consistently.

### 28.2 Merge Sort

- output is sorted;
- output is a permutation of input;
- merge comparisons and index advances follow the selected tie policy;
- empty and singleton lists are handled;
- even and odd sizes divide correctly;
- recursion depth matches expected values for curated powers of two.

### 28.3 Inversion Counting

- counts match brute force on exhaustive small permutations;
- equal values are not counted as inversions;
- returned list is sorted;
- `MergeAndCount` adds the number of unread left elements when appropriate;
- total equals left plus right plus crossing counts.

### 28.4 Closest Pair

- result distance matches brute force for generated small instances;
- multiple tied closest pairs are handled according to metadata;
- base cases inspect all pairs;
- strip membership follows the documented boundary convention;
- strip is processed in `y` order;
- each point compares with no more than the configured next-neighbor upper bound;
- stable partitioning handles equal `x` coordinates;
- recursive regions and return values match the trace.

### 28.5 Recurrence Tree

- level `i` has `a^i` nodes for uniform recurrences;
- size per node is `n / b^i`;
- total level work is computed correctly;
- depth and leaf-count formulas match numeric power-of-`b` examples;
- aggregated and expanded views report identical totals.

### 28.6 Master Theorem

- each curated recurrence extracts correct `a`, `b`, and `c`;
- case classification matches `c` versus `log_b(a)`;
- final asymptotic relation is correct;
- unsupported recurrences are never assigned a direct case;
- simple and general theorem scopes are distinguished;
- floating comparisons near equality use symbolic or tolerance-aware logic.

### 28.7 Decision Checkpoints

- accepts all declared valid tied answers;
- visual selections map to stable object IDs;
- restore returns to the exact recursive state;
- incorrect demonstration branches do not mutate the canonical trace;
- every response type is keyboard operable.

---

## 29. Release plan

### Release 0.11 — Recursive Execution Foundation

Implement:

- recursive call-frame model;
- recursion-specific trace events;
- recursion-tree component;
- call-stack component;
- immutable recursive snapshots;
- recursion-specific checkpoints;
- Divide & Conquer Anatomy Lab;
- Teacher and Presentation Mode extensions.

### Release 0.12 — Merge Sort

Implement:

- instrumented Merge Sort;
- synchronized array, tree, stack, and pseudocode views;
- reusable Merge visualizer;
- mid-execution prediction checkpoints;
- operation counters;
- recurrence derivation handoff;
- quadratic-sort comparison.

### Release 0.13 — Inversion Counting

Implement:

- Ranking Builder;
- inversion classification;
- instrumented `SortAndCount` and `MergeAndCount`;
- shared Merge visualizer integration;
- counter-increment checkpoints;
- brute-force comparison;
- correctness reflection.

### Release 0.14 — Recurrences and Master Theorem

Implement:

- recurrence model;
- Recursion Tree Builder;
- symbolic and numeric level tables;
- Balance-of-Work visualization;
- guided Master Theorem sequence;
- Recurrence Race;
- Applicability Detective;
- initial Substitution and Induction Builder.

### Release 0.15 — Closest Pair and Integration

Implement:

- point editor;
- brute-force and 1D comparisons;
- instrumented 2D closest-pair algorithm;
- active regions, strip, and pair comparison views;
- closest-pair checkpoints;
- Seven-Neighbor Challenge;
- Sorting Once versus Sorting Recursively;
- cross-module links to Recursion Tree and Growth Explorer;
- diagnostic and integrative activities.

Keep the site deployable and usable after every release.

---

## 30. Acceptance criteria

The Divide and Conquer iteration is complete when a student can:

1. label divide, conquer, combine, and base-case components;
2. predict a recursive call, return, or combine event;
3. connect a call-stack frame with a recursion-tree node;
4. execute Merge Sort step by step;
5. predict the next output of a merge;
6. derive `2T(n/2) + Theta(n)` from Merge Sort;
7. construct a ranking with a requested inversion count;
8. classify left, right, and crossing inversions;
9. predict the crossing-inversion increment during merge;
10. compare brute-force and divide-and-conquer inversion counts;
11. execute the closest-pair recursion on a point set;
12. construct the central strip;
13. predict relevant strip comparisons;
14. distinguish left, right, and crossing closest pairs;
15. explain the bounded-neighbor idea;
16. compare presorting once with sorting recursively;
17. complete the first levels of a recurrence tree;
18. derive level size, work, depth, and leaf count;
19. apply all three simple Master Theorem cases;
20. identify when the theorem does not apply directly;
21. assemble a guided substitution or induction argument;
22. rewind every algorithm to a previous checkpoint without inconsistent state;
23. complete all required interactions by keyboard;
24. explain how the divide/combine design produces the recurrence.

---

## 31. Non-goals

This iteration must not:

- accept arbitrary student code or pseudocode;
- become a general symbolic recurrence solver;
- use AI to grade written explanations;
- store grades or personal information;
- require a backend or authentication;
- add unrelated divide-and-conquer algorithms without a defined learning objective;
- treat an execution trace as a correctness proof;
- assume all divide-and-conquer algorithms create two equal subproblems;
- claim the Master Theorem applies to every recurrence;
- force a unique closest pair when distances tie;
- use measured runtime as a substitute for operation analysis;
- duplicate existing chart, checkpoint, or trace infrastructure.

---

## 32. Final implementation principle

Before adding an interaction, ask:

> **What recursive state or mathematical structure must the student understand to predict this event?**

A useful activity asks the student to reason about a subproblem, call frame, return value, merge index, inversion count, geometric strip, tree level, or recurrence term. Avoid checkpoints that merely ask for the next pseudocode line.

The visual execution must make three connections explicit:

1. **algorithm state** — what the recursive procedure is doing now;
2. **structural model** — how that action appears in the call tree or recurrence tree;
3. **asymptotic consequence** — how the number, size, and combination cost of subproblems determine total complexity.
