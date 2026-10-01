# LeetCode Helper

A simple personal coding practice tool for storing LeetCode and LeetCode-style questions, randomly generating a problem to solve, and automatically removing completed problems from the active question pool.

The goal is to make coding practice feel less structured and predictable. Instead of choosing problems manually, LeetCode Helper gives you a random problem from your own collection and keeps track of what you have already completed.

## Features

### Add Questions

Add LeetCode problems or custom interview/OA-style questions to your personal question bank.

A question can contain information such as:

- Problem title
- Problem description
- Difficulty
- Category / pattern
- LeetCode link
- Example input/output
- Personal notes

Example:

```text
Title: Two Sum
Difficulty: Easy
Category: Hash Map
Link: https://leetcode.com/problems/two-sum/
```

Custom questions can also be added without a LeetCode link.

---

### Random Question Generator

Press **Generate Question** to randomly select one problem from your remaining question pool.

For example:

```text
Remaining Questions: 24

Generate Question

→ Subarray Sum Equals K
  Medium
  Prefix Sum / Hash Map
```

This prevents choosing only familiar problems and makes practice more similar to an online assessment or interview.

---

### Complete Questions

After solving a problem, press:

```text
Mark as Completed
```

The question will be removed from the active question pool.

This means the random generator will no longer select that problem.

Example:

```text
Before:

Two Sum
Product Except Self
Number of Islands
House Robber
Koko Eating Bananas
```

After completing **Number of Islands**:

```text
Two Sum
Product Except Self
House Robber
Koko Eating Bananas
```

---

## Main Workflow

The basic workflow is:

```text
Add Questions
      ↓
Question Bank
      ↓
Generate Random Question
      ↓
Solve Problem
      ↓
Mark as Completed
      ↓
Remove From Active Pool
      ↓
Generate Another Question
```

The process continues until there are no questions remaining.

---

## MVP

The first version of LeetCode Helper will focus only on the core functionality.

### Version 1

- Add a question
- View all saved questions
- Randomly generate a question
- Mark a question as completed
- Remove completed questions from the active pool
- Display the number of questions remaining
- Store questions so they remain after refreshing the application

The initial goal is to keep the application simple before adding more advanced features.

---

## Example Question Object

A question could internally look like:

```json
{
  "id": 1,
  "title": "Longest Substring Without Repeating Characters",
  "difficulty": "Medium",
  "category": "Sliding Window",
  "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  "description": "",
  "completed": false
}
```

Custom OA-style questions could instead include the full problem description:

```json
{
  "id": 2,
  "title": "Shipment Order Window",
  "difficulty": "Medium",
  "category": "Arrays / Sorting",
  "link": null,
  "description": "Given shipmentOrders and windowSize...",
  "completed": false
}
```

---

## Possible Tech Stack

One possible stack for the project:

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

Start simple with:

- LocalStorage

This avoids needing a backend during the first version.

Later the project could move to:

- Python
- Flask or FastAPI
- SQLite / PostgreSQL

The backend could eventually manage questions, completed problems, statistics, and user progress.

---

## Suggested Project Structure

```text
leetcode-helper/
│
├── src/
│   ├── components/
│   │   ├── AddQuestion.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── QuestionList.jsx
│   │   └── RandomQuestion.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Questions.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│
├── package.json
└── README.md
```

---

## Future Features

Once the basic version works, LeetCode Helper could expand into a more complete interview preparation tool.

Potential features include:

- Filter questions by difficulty
- Filter questions by algorithm pattern
- Easy / Medium / Hard randomization
- Completed-question history
- Restore completed questions
- Reset the entire question pool
- Track how many questions were completed
- Track completion dates
- Track time spent solving each problem
- Built-in timer
- Personal notes
- Solution notes
- Hint system
- Favorite difficult problems
- Retry failed problems
- Difficulty statistics
- Category statistics
- Daily practice goals
- Practice streaks

---

## Random Practice Modes

Future versions could support different ways of generating questions.

### Fully Random

```text
Generate any remaining problem.
```

### By Difficulty

```text
Easy
Medium
Hard
```

### By Pattern

```text
Arrays
Hash Maps
Sliding Window
Two Pointers
Binary Search
Greedy
Heap
Graphs
BFS
DFS
Dynamic Programming
```

### OA Mode

Generate several random questions and simulate an online assessment.

Example:

```text
OA Session

Question 1 — Medium
Question 2 — Medium

Time Limit: 70 minutes
```

---

## Long-Term Idea

The long-term goal is for LeetCode Helper to become a personal coding interview practice environment rather than just a random question generator.

Eventually it could track areas such as:

```text
Sliding Window     ████████░░ 8 solved
Graphs             █████░░░░░ 5 solved
Dynamic Programming ███░░░░░░░ 3 solved
Binary Search      ███████░░░ 7 solved
```

This could help identify weaker algorithm patterns and generate more questions from those categories.

---

## Why I Built This

When practicing LeetCode, it can be easy to repeatedly choose familiar problems or spend time deciding what problem to solve next.

LeetCode Helper removes that decision.

I can build my own pool of LeetCode, interview, and online-assessment questions and let the application randomly decide what I should solve.

Once I solve a problem, it is removed from the active pool so I can continue working through the entire collection without repeating questions.

---

## Project Status

Currently in early development.

Initial focus:

```text
1. Project setup
2. Add question functionality
3. Question storage
4. Random question generation
5. Mark questions as completed
6. Remove completed questions from the active pool
```

More advanced progress tracking and interview-preparation features will be added after the core workflow is complete.
