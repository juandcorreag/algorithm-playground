# Algorithm Playground — Greedy Algorithms

## Functional and Technical Specification

**Proposed releases:** 0.7–0.10  
**Status:** Implementation specification  
**Primary audience:** Codex and future maintainers

---

## 1. Implementation directive

Implement Greedy Algorithms as a new family of learning laboratories within the existing Algorithm Playground. Preserve the current static-web architecture, the central algorithm registry, the instrumented execution engine, reusable traces, pseudocode rendering, Teacher Mode, Presentation Mode, accessibility support, and the separation between algorithms and learning activities.

Students must never enter arbitrary algorithms, pseudocode, or executable code. All algorithms and graph/interval instances are predefined or generated under instructor-defined constraints. Students may manipulate valid inputs, choose candidate decisions, construct counterexamples, predict updates, and explain conclusions.

The main interaction cycle for this family is:

> **PREDICT → CHOOSE → EXECUTE → OBSERVE → JUSTIFY → CHALLENGE → EXPLAIN**

The principal new feature is a reusable **Decision Checkpoint Engine**. At pedagogically significant moments, an execution pauses and asks the student to predict the next decision from the current algorithm state. Questions must assess semantic understanding of the algorithm—not memorization of the next pseudocode line.

Do not rewrite working modules merely to adopt this specification. Extend shared infrastructure incrementally and keep the application usable after every release.

---

## 2. Scope

Add a new home-page family:

```text
GREEDY ALGORITHMS
 ├ Greedy Strategy Lab
 ├ Scheduling Lab
 ├ Shortest Path Lab
 └ Minimum Spanning Tree Lab
```

The family contains these predefined algorithms and concepts:

1. Interval Scheduling
2. Interval Partitioning
3. Dijkstra's Shortest-Path Algorithm
4. Prim's Minimum Spanning Tree Algorithm
5. Kruskal's Minimum Spanning Tree Algorithm
6. Cut and cycle properties for MSTs
7. Exchange arguments and structural lower bounds

The initial implementation must not add unrelated greedy algorithms.

---

## 3. Learning objectives

After completing the activities, a student should be able to:

1. distinguish a greedy strategy from a specific greedy selection rule;
2. determine the next decision made by a greedy algorithm from its current state;
3. distinguish feasibility from optimality;
4. construct counterexamples for plausible but incorrect greedy rules;
5. recognize the role of exchange arguments, invariants, cuts, cycles, and lower bounds in correctness proofs;
6. execute Interval Scheduling and Interval Partitioning;
7. execute Dijkstra, including `extractMin` and edge relaxation;
8. explain why Dijkstra requires nonnegative edge weights;
9. execute Prim and Kruskal;
10. distinguish Prim from Dijkstra despite their similar implementations;
11. identify safe and rejectable MST edges using cut and cycle properties;
12. explain why experimental evidence does not constitute a correctness proof.

---

## 4. Architectural principles

### 4.1 Algorithms and activities remain separate

An algorithm definition provides:

- metadata;
- pseudocode;
- supported input types;
- execution logic;
- semantic trace events;
- state snapshots;
- validation helpers;
- complexity metadata.

An activity definition provides:

- learning objective;
- algorithm or concept used;
- predefined or generated instance;
- stage sequence;
- checkpoint policy;
- prompts and explanations;
- completion conditions.

The same algorithm must be reusable in multiple activities.

### 4.2 Trace first

Algorithms must produce a complete, deterministic execution trace before or during playback. The interface renders the trace; it must not contain algorithm-specific execution logic.

Every trace step must contain enough state to:

- render the current situation;
- move forward and backward;
- restore a checkpoint without recomputing prior steps;
- compare a student's prediction with the actual decision;
- support Presentation Mode.

### 4.3 Predefined algorithms only

Students may edit intervals, move graph vertices, change allowed weights, choose source vertices, select graph presets, and select decisions. They may not modify the algorithm implementation.

### 4.4 Evidence is not proof

All experimental modules must include this message:

> **Experimental evidence can suggest that a greedy rule works, but correctness requires a mathematical argument.**

Spanish support text:

> Los experimentos pueden sugerir que una regla greedy funciona, pero su correctitud requiere un argumento matemático.

---

## 5. Suggested project structure

Adapt paths to the existing project rather than duplicating working components.

```text
algorithm-playground/
├── greedy.html
├── greedy-strategy.html
├── scheduling.html
├── shortest-path.html
├── mst.html
├── css/
│   └── greedy-visualizers.css
├── js/
│   ├── core/
│   │   ├── decision-checkpoints.js
│   │   ├── checkpoint-renderer.js
│   │   └── checkpoint-validation.js
│   ├── algorithms/
│   │   ├── interval-scheduling.js
│   │   ├── interval-partitioning.js
│   │   ├── dijkstra.js
│   │   ├── prim.js
│   │   └── kruskal.js
│   ├── modules/
│   │   ├── greedy-strategy.js
│   │   ├── scheduling-lab.js
│   │   ├── shortest-path-lab.js
│   │   └── mst-lab.js
│   └── data/
│       ├── greedy-activities.js
│       ├── interval-instances.js
│       └── graph-instances.js
└── tests/
    └── greedy-tests.html
```

If the project already uses a different organization, preserve it and add equivalent modules in the appropriate locations.

---

## 6. Decision Checkpoint Engine

### 6.1 Purpose

Decision Checkpoints interrupt an algorithm at meaningful moments and ask the student to predict its next semantic decision using visible variables and data structures.

Examples include:

- select or reject an interval;
- reuse a room or create a new one;
- select the next vertex from a priority queue;
- predict whether a distance or key changes;
- accept or reject an edge;
- identify a cut, cycle, or invariant.

A checkpoint must not ask only which pseudocode line executes next.

### 6.2 Checkpoint model

```javascript
{
    id: "dijkstra-relax-c-d",
    stepIndex: 12,
    type: "predict-update",

    prompt: {
        es: "¿Se actualizará la distancia de D?",
        en: "Will D's tentative distance be updated?"
    },

    responseType: "choice",

    options: [
        {id: "update", label: {es: "Actualizar", en: "Update"}},
        {id: "keep", label: {es: "Conservar", en: "Keep"}}
    ],

    validAnswers: ["update"],

    stateProjection: {
        variables: ["u", "v", "distanceU", "edgeWeight", "distanceV"],
        structures: ["priorityQueue", "fixedVertices"]
    },

    hints: [
        {
            es: "Compara d[u] + w(u,v) con el valor actual de d[v].",
            en: "Compare d[u] + w(u,v) with the current value of d[v]."
        }
    ],

    explanation: {
        es: "Como 6 + 4 < 13, la nueva distancia tentativa es 10.",
        en: "Because 6 + 4 < 13, the new tentative distance is 10."
    }
}
```

### 6.3 Supported response types

Implement at least:

```text
single-choice
multiple-choice
numeric
select-visual-object
order-items
accept-reject
short-justification
```

Free text is not automatically graded semantically. Short explanations may be stored in page state and copied by the student, but must not be evaluated using an AI service.

### 6.4 Valid answers and ties

The validator must support more than one correct answer. This is necessary when:

- intervals have equal finishing times;
- priority-queue keys are tied;
- multiple minimum-weight edges cross a cut;
- multiple MSTs exist.

```javascript
validAnswers: ["edge-4", "edge-7"]
```

The explanation must acknowledge ties rather than imply uniqueness.

### 6.5 Feedback policy

Use three levels:

1. `retry`: indicate that the response does not match the rule without revealing the answer;
2. `hint`: highlight the relevant variable or structure;
3. `reveal`: show and explain the algorithm's actual decision.

An incorrect answer must not permanently block the activity. The activity should record attempts locally for the current session only.

### 6.6 Checkpoint policies

```javascript
{
    mode: "selected",        // all | selected | random | manual
    eventTypes: ["extractMin", "relaxEdge"],
    frequency: 2,
    maximum: 6,
    allowRetry: true,
    revealAfterAttempts: 2
}
```

Use a seeded pseudo-random generator when checkpoint selection or instance generation must be reproducible.

### 6.7 Interaction modes

#### Guided Mode

- frequent checkpoints;
- two attempts by default;
- contextual hints;
- explanations after each decision.

#### Challenge Mode

- checkpoints only at important decisions;
- fewer hints;
- optional streak and summary of results;
- no high-stakes score or grade.

#### Demonstration Mode

- intended for classroom projection;
- the instructor advances manually;
- a button labeled `ASK: WHAT HAPPENS NEXT?` inserts a checkpoint at the current eligible event;
- the instructor may execute a proposed incorrect decision temporarily and compare it with the real algorithm.

Executing an incorrect proposal must use a sandboxed branch of the visualization state and must not alter the canonical algorithm trace.

---

## 7. Shared trace extensions

Add the following semantic event types:

```text
considerCandidate
selectGreedy
rejectIncompatible
reuseResource
createResource
extractMin
relaxEdge
decreaseKey
fixVertex
crossCut
acceptEdge
rejectCycle
unionComponents
markSafe
markExcluded
checkpoint
```

Algorithms need not use every event.

### 7.1 Example trace event

```javascript
{
    step: 12,
    type: "relaxEdge",
    line: 7,

    variables: {
        u: "C",
        v: "D",
        distanceU: 6,
        edgeWeight: 4,
        oldDistanceV: 13,
        candidateDistance: 10
    },

    structures: {
        fixedVertices: ["A", "B", "C"],
        priorityQueue: [
            {vertex: "D", key: 13},
            {vertex: "E", key: 17}
        ],
        distances: {
            A: 0,
            B: 3,
            C: 6,
            D: 13,
            E: 17
        }
    },

    visualization: {
        activeVertex: "C",
        activeEdge: "C-D",
        comparedVertex: "D"
    },

    checkpointId: "dijkstra-relax-c-d"
}
```

### 7.2 Snapshot requirements

Every checkpoint-eligible trace step must include immutable snapshots of all structures needed by the renderer. Do not store mutable references shared by multiple steps.

Relevant structures include:

- selected intervals;
- current interval and last selected finish time;
- room assignments and room availability heap;
- fixed vertices;
- tentative distances and predecessors;
- priority queue contents;
- MST edges;
- connected components or Union-Find state;
- current cut and cycle.

---

## 8. Greedy Strategy Lab

### 8.1 Purpose

Help students distinguish plausible greedy rules from correct ones and understand the role of counterexamples and correctness proofs.

### 8.2 Initial problem

Use Interval Scheduling with half-open intervals:

\[
j=[s_j,f_j).
\]

Two intervals are compatible when the start of one is greater than or equal to the finish of the other.

### 8.3 Candidate rules

Provide these predefined rules:

```text
EARLIEST START
EARLIEST FINISH
SHORTEST DURATION
FEWEST CONFLICTS
```

### 8.4 Rule comparison activity

The student must:

1. predict which rule will produce the largest compatible set;
2. run every rule on the same instance;
3. observe selected and rejected intervals;
4. compare solution cardinalities;
5. determine which rule or rules fail on the instance;
6. explain why one successful example is not a proof.

Display for each rule:

- candidate order;
- current candidate;
- selected intervals;
- rejected intervals;
- solution cardinality.

### 8.5 Counterexample Builder

Allow the student to:

- move interval start and finish endpoints;
- add and delete intervals within configured limits;
- choose a candidate rule to challenge;
- run the rule;
- manually select a compatible comparison solution.

The activity succeeds when:

\[
|S_{student}| > |S_{rule}|.
\]

Validate that the student's set is compatible. It is not necessary to prove that the student's set is optimal.

Provide challenges for:

```text
Refute EARLIEST START
Refute SHORTEST DURATION
Refute FEWEST CONFLICTS
Can you refute EARLIEST FINISH?
```

For the final challenge, do not claim that failed attempts prove correctness. Transition to the exchange-argument activity.

### 8.6 Exchange Argument activity

Show a greedy solution and an optimal solution that differ. Ask the student to:

1. identify their first position of disagreement;
2. select the optimal-solution interval to replace;
3. select the greedy interval that replaces it;
4. indicate which properties are preserved.

Correct properties:

- feasibility is preserved;
- cardinality is preserved;
- agreement with the greedy solution increases by one position.

Use a visual before/after exchange. Do not reveal the entire proof before the student attempts the exchange.

---

## 9. Scheduling Lab — Interval Scheduling

### 9.1 Algorithm

Use the earliest-finish-time algorithm:

1. sort intervals by nondecreasing finish time;
2. select the first interval;
3. scan the remaining intervals;
4. select interval `j` when `s[j] >= lastFinish`;
5. update `lastFinish = f[j]`.

The implementation should compare each candidate only with the finish time of the last selected interval.

### 9.2 Visual states

```text
UNSEEN
CURRENT
COMPATIBLE
INCOMPATIBLE
SELECTED
REJECTED
```

Do not encode state using color alone. Use borders, patterns, icons, and labels.

### 9.3 Required displays

- timeline containing all intervals;
- sorted candidate list;
- selected set `S`;
- current interval;
- `lastFinish`;
- highlighted pseudocode line;
- trace controls;
- checkpoint prompt.

### 9.4 Required checkpoints

#### Select or reject

Given the current interval and `lastFinish`, ask whether it will be selected.

#### Choose the next candidate

Ask which interval the algorithm considers next from the ordered list.

#### Predict state update

If selected, ask for the new value of `lastFinish`.

#### Explain the criterion

Ask the student to distinguish earliest finish from shortest duration or earliest start.

### 9.5 Experiment table

Allow comparison of several instances or rules:

| Instance | Rule | Selected intervals | Cardinality |
|---|---|---|---:|

Do not imply that largest observed cardinality proves correctness for all instances.

---

## 10. Scheduling Lab — Interval Partitioning

### 10.1 Objective

Schedule every interval using the minimum number of rooms or resources.

Make the distinction explicit:

| Problem | Objective |
|---|---|
| Interval Scheduling | Select the largest compatible subset |
| Interval Partitioning | Assign every interval using the fewest rooms |

### 10.2 Algorithm

1. sort intervals by nondecreasing start time;
2. maintain a min-heap of rooms keyed by the finish time of each room's last interval;
3. inspect the room with minimum finish time;
4. if `s[j] >= minFinish`, reuse that room;
5. otherwise create a new room;
6. update the assigned room's key to `f[j]`.

The compatibility comparison must use `s[j]`, not `f[j]`.

### 10.3 Required displays

- intervals ordered by start time;
- rooms as separate timelines;
- min-heap of rooms;
- current interval `[s[j], f[j])`;
- minimum room finish time;
- current number of rooms;
- maximum depth observed.

### 10.4 Required checkpoints

#### Reuse or create

Ask whether the current interval reuses the earliest available room or opens a new one.

#### Select the room

When several rooms exist, ask which one the algorithm examines or reuses. Support tied minimum finish times.

#### Predict the heap update

Ask for the new key after assigning the interval. The answer is `f[j]`.

#### Structural justification

When a new room opens, ask why it is unavoidable. The correct explanation must identify that all existing rooms are occupied at `s[j]`.

### 10.5 Depth Challenge

Allow the student to select a point in time. Highlight all intervals containing that point and display their count.

Ask the student to find a time witnessing a lower bound of `d` rooms. Connect the observation to:

\[
\text{minimum number of rooms}=\text{maximum depth}.
\]

---

## 11. Shortest Path Lab — Dijkstra

### 11.1 Preconditions

Use directed or undirected graphs according to explicit activity metadata. Every standard Dijkstra activity must satisfy:

\[
w(e)\geq 0.
\]

Negative-edge examples belong only to the dedicated failure activity and must be visibly labeled as violating the precondition.

### 11.2 Required displays

- graph with weighted edges;
- source vertex;
- fixed set `S`;
- priority queue;
- table of tentative distances and predecessors;
- active vertex and active edge;
- highlighted pseudocode;
- reconstructed paths when requested.

Example table:

| Vertex | Tentative distance | Predecessor | Status |
|---|---:|---|---|
| A | 0 | — | Fixed |
| B | 7 | A | Frontier |
| C | 5 | A | Frontier |
| D | infinity | — | Unseen |

Define clearly whether `pred[v]` stores a predecessor vertex or predecessor edge and use that convention consistently.

### 11.3 Required checkpoints

#### Predict `extractMin`

Ask which vertex will be removed from the priority queue. Accept all tied minimum-key vertices when the implementation permits arbitrary tie resolution.

#### Predict relaxation

Given:

\[
d[u],\quad w(u,v),\quad d[v],
\]

ask:

1. whether `d[v]` changes;
2. its new value;
3. its new predecessor;
4. whether `decreaseKey` occurs.

#### Select all changes

After fixing a vertex, ask the student to select every neighbor whose tentative distance will decrease.

#### Identify the invariant

Ask which statement is guaranteed for vertices in `S`. The correct idea is that their fixed distances equal their shortest-path distances.

### 11.4 Negative Edge Challenge

Provide a small predefined graph containing a negative edge but no negative cycle. The activity must:

1. ask the student to predict Dijkstra's next decisions;
2. show the vertex that is fixed prematurely;
3. reveal a shorter path discovered later;
4. ask which assumption failed;
5. connect the failure to the correctness argument.

Do not silently run this instance as if it were valid input for standard Dijkstra.

### 11.5 Complexity view

Show operation counts separately from measured runtime. At minimum support:

- array-based priority queue;
- binary heap.

State the graph representation and assumptions when presenting complexity.

---

## 12. Minimum Spanning Tree Lab

Provide four modes:

```text
CUT & CYCLE
PRIM
KRUSKAL
COMPARE
```

Graphs are undirected. Activities must state whether edge weights are distinct. Include some instances with ties and multiple MSTs.

### 12.1 Cut & Cycle mode

Allow a student to select a subset `S` of vertices. Highlight:

\[
\delta(S)=\{(u,v)\in E: |\{u,v\}\cap S|=1\}.
\]

Required tasks:

- identify all edges crossing a cut;
- choose a minimum-weight crossing edge;
- determine whether an edge is safe under the stated conditions;
- identify a maximum-weight edge on a cycle that may be excluded;
- observe how ties affect uniqueness.

Do not state that a particular edge belongs to every MST when ties only guarantee that some MST contains an eligible minimum edge.

### 12.2 Red/blue rules

If red/blue terminology is retained from the teaching material:

- blue means selected/safe;
- red means excluded;
- an uncolored edge remains undecided.

Use the cut and cycle rules as guided activities after students have encountered concrete examples. The visualizer must display the cut or cycle that justifies a color change.

---

## 13. Prim's Algorithm

### 13.1 Required displays

- current tree `T`;
- vertices inside and outside `T`;
- edges crossing the current cut;
- key and predecessor for each outside vertex;
- priority queue;
- selected edge;
- total MST weight.

### 13.2 Required checkpoints

#### Select the next vertex or edge

Ask which minimum-key vertex is extracted and which predecessor edge enters the tree.

Do not add a predecessor edge for the initial root, whose predecessor is null.

#### Predict key updates

After adding `u`, ask which adjacent vertices change keys and what their new key and predecessor will be.

#### Identify the certifying cut

Ask the student to identify the cut `(V(T), V - V(T))` that makes the chosen minimum edge safe.

### 13.3 Prim versus Dijkstra checkpoint

Use the same graph state and edge to ask how each algorithm computes a candidate key:

| Algorithm | Candidate value |
|---|---|
| Dijkstra | `d[u] + w(u,v)` |
| Prim | `w(u,v)` |

The side-by-side comparison must state that Dijkstra optimizes source-to-vertex path length, while Prim optimizes the weight of the connecting tree edge.

---

## 14. Kruskal's Algorithm

### 14.1 Algorithm

1. sort edges by nondecreasing weight;
2. initialize one component per vertex;
3. consider edges in sorted order;
4. accept `(u,v)` when `find(u) != find(v)`;
5. union the two components;
6. otherwise reject the edge because it would create a cycle;
7. stop after selecting `|V|-1` edges.

### 14.2 Required displays

- ordered edge list;
- current edge;
- accepted and rejected edges;
- connected components;
- simplified Union-Find state;
- selected-edge count;
- total weight.

### 14.3 Required checkpoints

#### Accept or reject

Ask whether the current edge should be accepted. Require the student to inspect the endpoints' components.

#### Predict the operation

Ask whether the next operation is `union`, no change, or termination.

#### Identify the cycle

When an edge is rejected, ask the student to identify the path that, together with the candidate edge, forms a cycle.

#### Completion

Ask when the algorithm can stop. Correct answer: after selecting `|V|-1` edges for a connected graph.

### 14.4 Union-Find detail

The main view should show components and the results of `find`. Union by rank and path compression may appear in an advanced collapsible panel but must not distract from the greedy decision.

Complexity explanation:

\[
O(m\log m)+O(m\alpha(n))=O(m\log m).
\]

---

## 15. Comparison activities

### 15.1 Prim versus Kruskal

Show both algorithms on the same graph and ask whether their next edges coincide.

Explain:

| Prim | Kruskal |
|---|---|
| Maintains one growing tree | Maintains a forest of components |
| Chooses a light edge crossing the tree cut | Chooses the next global light edge that does not create a cycle |
| Uses vertex keys and a priority queue | Uses sorted edges and Union-Find |

With tied weights, allow different MSTs with equal total weight.

### 15.2 Dijkstra versus Prim

Provide a synchronized step mode highlighting their similar priority-queue structure and different key semantics.

### 15.3 Rule versus proof

After an algorithm succeeds on several generated instances, ask:

> Does this establish that the algorithm is always optimal?

The correct answer is no. Link to the appropriate exchange, invariant, cut, cycle, or structural argument.

---

## 16. Reusable activity model

```javascript
{
    id: "dijkstra-next-decision",
    family: "greedy",
    algorithm: "dijkstra",

    stages: [
        "predict",
        "execute",
        "checkpoint",
        "observe",
        "justify",
        "explain"
    ],

    instance: "graph-dijkstra-04",

    checkpointPolicy: {
        mode: "selected",
        eventTypes: ["extractMin", "relaxEdge"],
        frequency: 2,
        maximum: 6
    },

    questions: [],
    conclusion: {}
}
```

Examples of activities reusing Dijkstra:

```text
Dijkstra: choose the next vertex
Dijkstra: predict a relaxation
Dijkstra: identify the invariant
Dijkstra: diagnose failure with a negative edge
Dijkstra: compare key semantics with Prim
```

---

## 17. Instance design

### 17.1 General requirements

Provide both curated presets and constrained random generation. Curated instances must be the default for guided activities because they guarantee meaningful decision points.

Each instance should include metadata:

```javascript
{
    id: "mst-ties-02",
    concepts: ["ties", "multiple-msts", "cut-property"],
    difficulty: "intermediate",
    expectedCheckpoints: 5,
    allowsMultipleSolutions: true
}
```

### 17.2 Interval instances

Include examples that demonstrate:

- failure of earliest start;
- failure of shortest duration;
- failure of fewest conflicts;
- successful earliest finish;
- tied finish times;
- depth lower bounds;
- cases where rooms can and cannot be reused.

### 17.3 Graph instances

Include examples that demonstrate:

- multiple distance relaxations;
- tied tentative distances;
- unreachable vertices;
- invalid Dijkstra input with a negative edge;
- unique MST;
- multiple MSTs due to ties;
- Prim and Kruskal selecting different valid edge orders;
- Kruskal rejecting an edge that closes a visible cycle.

Random graph generation must guarantee the intended properties or clearly label when it does not.

---

## 18. Teacher and Presentation Modes

Extend `?teacher=1` with:

- choose activity and preset;
- set or display the random seed;
- pause at every eligible decision;
- insert a manual checkpoint;
- accept a proposed answer from the class;
- temporarily simulate an incorrect choice;
- reveal the proof connection;
- show all variables and data structures;
- reset to the previous checkpoint;
- hide secondary controls.

Presentation Mode must enlarge:

- graph and interval visualizations;
- priority queues and room heaps;
- selected variables;
- checkpoint question and answer options;
- pseudocode;
- explanation text.

The instructor must be able to operate step, pause, reveal, and reset using a keyboard or presentation remote where browser key events permit it.

---

## 19. EMI/CLIL language support

Keep principal interaction labels in English:

```text
PREDICT
CHOOSE
EXECUTE
OBSERVE
JUSTIFY
CHALLENGE
EXPLAIN
ACCEPT
REJECT
REUSE ROOM
CREATE ROOM
```

Provide contextual Spanish support and a Language Toolbox containing:

```text
The algorithm selects ___ because...
This interval is compatible with...
The next vertex extracted is...
The tentative distance decreases from ___ to ___.
This edge crosses the cut...
Accepting this edge would create a cycle.
The greedy choice is safe because...
This exchange preserves feasibility.
The algorithm fails on this instance because...
```

Language support must not obscure the algorithm state or visualization.

---

## 20. Accessibility

Meet the existing accessibility requirements and add:

- every visual selection must have a keyboard alternative;
- graph vertices and edges must be focusable in logical order;
- intervals must be selectable without drag-and-drop;
- state must not rely on color alone;
- paused checkpoints must receive keyboard focus;
- feedback must be announced through an ARIA live region;
- animation must be pausable and reducible;
- text alternatives must describe the current graph or schedule state;
- numerical values shown only through position must also be available as text.

---

## 21. Persistence and privacy

Do not store academic grades or personal information.

`localStorage` may store only preferences such as:

```text
language
presentationMode
lastGreedyModule
animationSpeed
checkpointMode
selectedDifficulty
```

Predictions and attempts should remain in current page/session state unless a future specification explicitly introduces export.

---

## 22. Testing

Add automated or browser-based tests for algorithm correctness, trace consistency, checkpoints, and rendering-independent validation.

### 22.1 Interval Scheduling

- selected intervals are pairwise compatible;
- the implementation follows nondecreasing finish order;
- `lastFinish` changes only after selection;
- curated instances match their known optimal cardinality;
- tied finishes produce valid behavior.

### 22.2 Interval Partitioning

- every interval is assigned exactly once;
- intervals in the same room are compatible;
- reuse checks `s[j] >= minFinish`;
- updated heap key equals `f[j]`;
- curated instances use a number of rooms equal to known maximum depth.

### 22.3 Dijkstra

- distances match known results on nonnegative graphs;
- fixed distances never change;
- relaxations use `d[u] + w(u,v)`;
- unreachable vertices remain at infinity;
- the negative-edge activity is flagged invalid for standard Dijkstra;
- trace snapshots are immutable.

### 22.4 Prim

- selected edges form a tree;
- total weight matches the expected MST weight;
- updates use `w(u,v)`, not path distance;
- the root contributes no null predecessor edge;
- tied minimum keys validate all permitted choices.

### 22.5 Kruskal

- accepted edges never create a cycle;
- accepted endpoints are in distinct components before union;
- connected graphs finish with `|V|-1` accepted edges;
- total weight matches the expected MST weight;
- tied edge orders remain valid.

### 22.6 Checkpoint Engine

- accepts all declared valid tied answers;
- rejects invalid options;
- retry/hint/reveal policy is respected;
- numeric tolerance is configurable where needed;
- restoring a checkpoint restores every structure;
- temporary incorrect branches do not mutate the canonical trace;
- keyboard interaction works for every response type.

---

## 23. Release plan

### Release 0.7 — Greedy Interaction Engine

Implement:

- Decision Checkpoint model;
- checkpoint renderer and validator;
- single, multiple, numeric, ordering, and visual-object responses;
- tied valid answers;
- retry, hint, and reveal;
- checkpoint policies;
- immutable trace snapshots;
- Guided, Challenge, and Demonstration modes;
- Teacher Mode controls.

### Release 0.8 — Scheduling

Implement:

- Greedy Strategy Lab;
- Interval Scheduling;
- candidate-rule comparison;
- Counterexample Builder;
- exchange-argument activity;
- Interval Partitioning;
- room min-heap visualization;
- Depth Challenge.

### Release 0.9 — Dijkstra

Implement:

- graph and priority-queue visualization;
- distance/predecessor table;
- `extractMin` checkpoints;
- relaxation checkpoints;
- invariant activity;
- negative-edge failure activity;
- operation/complexity view;
- initial Prim comparison.

### Release 0.10 — Minimum Spanning Trees

Implement:

- Cut & Cycle mode;
- optional red/blue rule activity;
- Prim;
- Kruskal;
- component and simplified Union-Find visualization;
- Prim–Kruskal comparison;
- full Prim–Dijkstra comparison;
- unique and non-unique MST instances.

Keep the site deployable and usable after each release.

---

## 24. Acceptance criteria

The Greedy Algorithms iteration is complete when a student can:

1. compare four candidate Interval Scheduling rules;
2. construct and validate a counterexample for an incorrect rule;
3. perform a guided exchange in a correctness argument;
4. predict whether an interval will be selected or rejected;
5. predict whether Interval Partitioning reuses or creates a room;
6. read and update the room min-heap;
7. relate the required number of rooms to maximum depth;
8. select Dijkstra's next vertex from the current queue;
9. predict the complete result of a relaxation;
10. identify Dijkstra's fixed-distance invariant;
11. explain the failure caused by a negative edge;
12. select a safe edge using a cut;
13. identify an edge rejectable by a cycle property;
14. predict Prim's next decision and key updates;
15. accept or reject Kruskal's next edge using component state;
16. distinguish Prim's key from Dijkstra's tentative distance;
17. observe that tied choices can yield different valid optimal solutions;
18. advance and rewind through all algorithm traces;
19. complete every checkpoint using mouse or keyboard;
20. explain why the relevant local greedy decision is safe.

---

## 25. Non-goals

This iteration must not:

- accept arbitrary student code or pseudocode;
- attempt automatic complexity analysis;
- use AI to grade written explanations;
- store formal grades or personal information;
- introduce a backend or authentication requirement;
- implement every known greedy algorithm;
- present empirical success as proof;
- force a unique answer when the algorithm permits ties;
- make advanced priority-queue or Union-Find details prerequisites for understanding the greedy decision.

---

## 26. Final implementation principle

Before adding any checkpoint, ask:

> **What algorithm state must the student understand to predict this decision?**

Do not add checkpoints that merely test recall of pseudocode order. A useful checkpoint requires the student to interpret compatibility, resource availability, a priority queue, tentative distances, a cut, a cycle, or connected components. The visual execution should then make the consequence of that decision observable and connect it to the algorithm's correctness argument.
